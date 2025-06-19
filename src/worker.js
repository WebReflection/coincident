import * as sabayon from 'sabayon/worker';

import nextResolver from 'next-resolver';

import { decoder } from 'reflected-ffi/decoder';

import * as transferred from './transfer.js';

import {
  create,
  defaults,
  maxByteLength,
  minByteLength,
  native,
  result,
  set,
  stop,
} from './utils.js';

// wait for the channel before resolving
const bootstrap = Promise.withResolvers();

sabayon.addEventListener(
  'message',
  event => {
    stop(event);
    const [ID, noServiceWorker] = event.data;
    const channel = event.ports[0];
    bootstrap.resolve({ ID, SW: !noServiceWorker, channel })
  },
  { once: true }
);

export default async options => {
  const { ID, SW, channel } = await bootstrap.promise;
  const WORKAROUND = !!ID;
  const direct = native || SW;
  const transform = options?.transform;
  const decode = (options?.decoder || decoder)(defaults);
  const checkTransferred = options?.transfer !== false;

  let i32a, pause, wait;
  if (direct) {
    const sab = new sabayon.SharedArrayBuffer(
      options?.minByteLength || minByteLength,
      { maxByteLength: options?.maxByteLength || maxByteLength }
    );
    i32a = new sabayon.Int32Array(sab);
    ({ pause, wait } = sabayon.Atomics);
    // prefer the fast path when possible
    if (pause && !WORKAROUND && !(sab instanceof ArrayBuffer)) {
      wait = (view, index) => {
        while (view[index] < 1) pause();
      };
    }
  }

  const [ next, resolve ] = nextResolver(String);
  const callbacks = new Map;
  const proxied = create(null);
  const proxy = new Proxy(proxied, {
    get(_, name) {
      // the curse of potentially awaiting proxies in the wild
      // requires this ugly guard around `then`
      if (name === 'then') return;
      let cb = callbacks.get(name);
      if (!cb) {
        callbacks.set(name, cb = (...args) => {
          const transfer = transferred.get(checkTransferred, args);
          const data = [i32a, name, transform ? args.map(transform) : args];
          // synchronous request
          if (direct) {
            if (WORKAROUND) sabayon.postMessage({ ID, data }, transfer);
            else channel.postMessage(data, transfer);
            wait(i32a, 0);
            i32a[0] = 0;
            const result = i32a[1] ? decode(i32a[1], i32a.buffer) : void 0;
            if (result instanceof Error) throw result;
            return result;
          }
          // postMessage based request
          else {
            const [uid, promise] = next();
            data[0] = uid;
            channel.postMessage(data, transfer);
            return promise;
          }
        });
      }
      return cb;
    },
    set
  });

  channel.onmessage = async ({ data }) => {
    if (typeof data[0] === 'string')
      resolve.apply(null, data);
    else {
      await result(data, proxied, transform);
      channel.postMessage(data);
    }
  };

  return {
    native,
    proxy,
    transfer: transferred.set,
  };
};
