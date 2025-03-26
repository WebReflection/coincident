import {
  SharedArrayBuffer,
  Atomics,
  native,
} from 'sabayon/lite/worker';

import { Decoder } from 'buffered-clone/decoder';

import { assign, create, defaults, set, withResolvers } from './utils.js';

const { wait, waitAsync } = Atomics;

// wait for the channel before resolving
const bootstrap = withResolvers();
let port;
addEventListener(
  'message',
  event => {
    [port] = event.ports;
    bootstrap.resolve();
  },
  { once: true }
);

const callbacks = new Map;

export default async options => {
  const $ = (result, name) => {
    if (result !== 'ok') console.warn(`Atomics.notify ${name} ${result}`);
    return i32a[1] ? decode(ui8a) : void 0;
  };

  const bufferAndViews = buffer => [
    buffer,
    new Uint8Array(buffer, defaults.byteOffset),
    new Int32Array(buffer),
  ];

  const { decode } = new Decoder(
    assign({}, options, defaults)
  );

  const transform = options?.transform;
  const proxied = create(null);
  const proxy = new Proxy(proxied, {
    get(_, name) {
      let cb = callbacks.get(name);
      if (!cb) {
        callbacks.set(name, cb = (...args) => {
          i32a[0] = 0;
          port.postMessage([buffer, name, transform ? args.map(transform) : args]);
          if (native)
            return $(wait(i32a, 0), name);
          else {
            return waitAsync(i32a, 0).value.then(result => {
              [buffer, ui8a, i32a] = bufferAndViews(i32a.buffer);
              return $(result, name);
            });
          }
        });
      }
      return cb;
    },
    set
  });

  let [buffer, ui8a, i32a] = bufferAndViews(
    new SharedArrayBuffer(
      options?.minByteLength || 0xFFFF,
      { maxByteLength: options?.maxByteLength || 0x1000000 }
    )
  );

  await bootstrap.promise;

  port.onmessage = async ({ data: [uid, name, args] }) => {
    const response = [uid, null, null];
    try {
      const result = await proxied[name](...args);
      response[1] = transform ? transform(result) : result;
    }
    catch (error) { response[2] = error }
    port.postMessage(response);
  };

  return { native, proxy };
};
