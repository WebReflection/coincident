import { Decoder } from 'buffered-clone/decoder';

import {
  SharedArrayBuffer,
  Atomics,
  native,
} from 'sabayon/lite/worker';

import {
  assign,
  create,
  defaults,
  set,
  stop,
  transfer,
  transferable,
  withResolvers,
} from './utils.js';

const { wait, waitAsync } = Atomics;

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

const callbacks = new Map;

export default async options => {
  const $ = (result, name) => {
    // TODO: investigate why this happens
    // if (result !== 'ok') console.warn(`Atomics.notify ${name} ${result}`);
    return i32a[1] ? decode(ui8a) : void 0;
  };

  const views = buffer => [
    new Uint8Array(buffer, defaults.byteOffset),
    new Int32Array(buffer),
  ];

  const { decode } = new Decoder(
    assign({}, options, defaults)
  );

  const [ID, channel] = await bootstrap.promise;
  // @bug https://bugzilla.mozilla.org/show_bug.cgi?id=1956778
  const WORKAROUND = native && !!ID;

  const interrupt = options?.interrupt;
  const transform = options?.transform || false;
  const proxied = create(null);
  const proxy = new Proxy(proxied, {
    get(_, name) {
      let cb = callbacks.get(name);
      if (!cb) {
        callbacks.set(name, cb = (...args) => {
          const data = [i32a, name, transform ? args.map(transform) : args];
          i32a[0] = 0;
          if (WORKAROUND) postMessage({ ID, data }, transferable(args));
          else channel.postMessage(data, transferable(args));
          if (native)
            return $(waitSync(i32a, 0), name);
          else {
            return waitAsync(i32a, 0).value.then(result => {
              [ui8a, i32a] = views(i32a.buffer);
              return $(result, name);
            });
          }
        });
      }
      return cb;
    },
    set
  });

  let [ui8a, i32a] = views(
    new SharedArrayBuffer(
      options?.minByteLength || 0xFFFF,
      { maxByteLength: options?.maxByteLength || 0x1000000 }
    )
  );

  // ℹ️ for backward compatibility (never used to date)
  let waitSync = wait;
  if (interrupt) {
    const { handler, timeout = 42 } = interrupt;
    waitSync = (sb, index, result) => {
      while ((result = wait(sb, index, 0, timeout)) === 'timed-out')
        handler();
      return result;
    };
  }

  channel.onmessage = async ({ data: [uid, name, args] }) => {
    const response = [uid, null, null];
    try {
      const result = await proxied[name](...args);
      response[1] = transform ? transform(result) : result;
    }
    catch (error) { response[2] = error }
    channel.postMessage(response);
  };

  return { native, proxy, transfer };
};
