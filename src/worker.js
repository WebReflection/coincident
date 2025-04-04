import { Decoder } from 'buffered-clone/decoder';

import {
  assign,
  create,
  defaults,
  native,
  resolve,
  result,
  set,
  stop,
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

  let id = 0, ui8a, i32a, waitSync;
  if (native) {
    const sab = new SharedArrayBuffer(
      options?.minByteLength || 0xFFFF,
      { maxByteLength: options?.maxByteLength || 0x1000000 }
    );
    ui8a = new Uint8Array(sab, defaults.byteOffset);
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

  const { decode } = new Decoder(
    assign({}, options, defaults)
  );

  const promises = native ? null : new Map;
  const callbacks = new Map;
  const proxied = create(null);
  const proxy = new Proxy(proxied, {
    get(_, name) {
      let cb = callbacks.get(name);
      if (name !== 'then' && !cb) {
        callbacks.set(name, cb = (...args) => {
          const data = [i32a, name, transform ? args.map(transform) : args];
          // synchronous request
          if (native) {
            if (WORKAROUND) postMessage({ ID, data });
            else channel.postMessage(data);
            waitSync(i32a, 0);
            i32a[0] = 0;
            const result = i32a[1] ? decode(ui8a) : void 0;
            if (result instanceof Error) throw result;
            return result;
          }
          // postMessage based request
          else {
            const uid = String(id++);
            const wr = withResolvers();
            data[0] = uid;
            promises.set(uid, wr);
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
      resolve(promises, uid, name, args);
    else {
      const response = await result(uid, proxied[name], args, transform);
      channel.postMessage(response);
    }
  };

  return { native, proxy };
};
