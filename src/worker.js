import { decoder } from './json/decoder.js';

import {
  create,
  defaults,
  maxByteLength,
  minByteLength,
  native,
  result,
  rtr,
  set,
  stop,
  ui8View,
  withResolvers,
} from './utils.js';

// wait for the channel before resolving
const bootstrap = withResolvers();

addEventListener(
  'message',
  event => {
    stop(event);
    bootstrap.resolve([event.data, event.ports[0]])
  },
  { once: true }
);

export default async options => {
  const [ID, channel] = await bootstrap.promise;
  const WORKAROUND = native && !!ID;
  const transform = options?.transform;
  const decode = (options?.decoder || decoder)(defaults);

  let ui8a, i32a, waitSync;
  if (native) {
    const sab = new SharedArrayBuffer(
      options?.minByteLength || minByteLength,
      { maxByteLength: options?.maxByteLength || maxByteLength }
    );
    ui8a = ui8View(sab);
    i32a = new Int32Array(sab);
    waitSync = Atomics.wait;

    // ℹ️ for backward compatibility (never used to date)
    const interrupt = options?.interrupt;
    if (interrupt) {
      const { handler, timeout = 42 } = interrupt;
      waitSync = (sb, index, result) => {
        while ((result = wait(sb, index, 0, timeout)) === 'timed-out')
          handler();
        return result;
      };
    }
  }

  const [ next, resolve ] = rtr(String);
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
          const data = [i32a, name, transform ? args.map(transform) : args];
          // synchronous request
          if (native) {
            if (WORKAROUND) postMessage({ ID, data });
            else channel.postMessage(data);
            waitSync(i32a, 0);
            i32a[0] = 0;
            const result = i32a[1] ? decode(i32a[1], ui8a) : void 0;
            if (result instanceof Error) throw result;
            return result;
          }
          // postMessage based request
          else {
            const [uid, wr] = next();
            data[0] = uid;
            channel.postMessage(data);
            return wr.promise;
          }
        });
      }
      return cb;
    },
    set
  });

  channel.onmessage = async ({ data: [uid, name, args] }) => {
    if (typeof uid === 'string')
      resolve(uid, name, args);
    else {
      const response = await result(uid, proxied[name], args, transform);
      channel.postMessage(response);
    }
  };

  return { native, proxy };
};
