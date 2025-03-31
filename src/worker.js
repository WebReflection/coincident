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
  const sab = () => new SharedArrayBuffer(
    options?.minByteLength || 0xFFFF,
    { maxByteLength: options?.maxByteLength || 0x1000000 }
  );

  const views = buffer => [
    new Uint8Array(buffer, defaults.byteOffset),
    new Int32Array(buffer),
  ];

  const reviews = () => native ? same : views(sab());
  const same = views(sab());

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
      // the curse of potentially awaiting proxies in the wild
      // requires this ugly guard around `then`
      // if (name !== 'then' && !cb) {
      if (!cb) {
        callbacks.set(name, cb = (...args) => {
          const [ui8a, i32a] = reviews();
          const transfer = transferable(args);
          const data = [i32a, name, transform ? args.map(transform) : args];
          if (WORKAROUND) postMessage({ ID, data }, transfer);
          else channel.postMessage(data, transfer);
          if (native) {
            waitSync(i32a, 0);
            i32a[0] = 0;
            return i32a[1] ? decode(ui8a) : void 0;
          }
          else {
            return waitAsync(i32a, 0).value.then(() => (
              i32a[1] ? decode(ui8a) : void 0
            ));
          }
        });
      }
      return cb;
    },
    set
  });

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
