import withResolvers from '@webreflection/utils/with-resolvers';

import nextResolver from 'next-resolver';

import { decoder } from 'reflected-ffi/decoder';

import * as transferred from './transfer.js';

import * as sabayon from './sabayon/index.js';

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

const { setPrototypeOf } = Reflect;
let { postMessage } = globalThis;

// wait for the channel before resolving
const bootstrap = withResolvers();
const MPP = sabayon.MessagePort.prototype;

addEventListener(
  'message',
  event => {
    stop(event);
    const [ID, SW, ffi_timeout] = event.data;
    const [channel] = event.ports;
    if (SW) {
      setPrototypeOf(channel, MPP);
      if (ID) postMessage = sabayon.postMessage;
    }
    bootstrap.resolve([ID, SW, ffi_timeout, channel]);
  },
  { once: true }
);

export default async options => {
  const [ID, SW, ffi_timeout, channel] = await sabayon.register().then(() => bootstrap.promise);
  const WORKAROUND = !!ID;
  const direct = native || !!SW;
  const transform = options?.transform;
  const decode = (options?.decoder || decoder)(defaults);
  const checkTransferred = options?.transfer !== false;

  let i32a, load, pause, wait;
  if (direct) {
    const SAB = SW ? sabayon.SharedArrayBuffer : SharedArrayBuffer;
    const sab = new SAB(
      options?.minByteLength || minByteLength,
      { maxByteLength: options?.maxByteLength || maxByteLength }
    );
    i32a = new Int32Array(sab);
    if (SW) {
      ({ wait } = sabayon.Atomics);
      sabayon.track(i32a);
    }
    else {
      ({ load, pause, wait } = Atomics);
      // prefer the fast path when possible
      if (pause) {
        wait = (view, index) => {
          do { pause() } while (load(view, index) < 1);
        };
      }
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
            if (WORKAROUND) postMessage({ ID, data }, transfer);
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

  channel.addEventListener('message', async ({ data }) => {
    if (typeof data[0] === 'string')
      resolve.apply(null, data);
    else {
      await result(data, proxied, transform);
      channel.postMessage(data);
    }
  });

  channel.start();

  return {
    native,
    proxy,
    ffi_timeout,
    sync: direct,
    transfer: transferred.set,
  };
};
