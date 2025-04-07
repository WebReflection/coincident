import { encoder } from './json/encoder.js';

import {
  ID,
  assign,
  create,
  defaults,
  native,
  result,
  rtr,
  set,
  stop,
} from './utils.js';

// @bug https://bugzilla.mozilla.org/show_bug.cgi?id=1956778
// Note: InstallTrigger is deprecated so once it's gone I do hope
//       this workaround would be gone too!
const UID = 'InstallTrigger' in globalThis ? ID : '';

const { notify } = Atomics;

export default options => {
  const transform = options?.transform;
  const encode = (options?.encoder || encoder)(defaults);

  class Worker extends globalThis.Worker {
    constructor(url, options) {
      const { port1: channel, port2 } = new MessageChannel;
      const [ next, resolve ] = rtr();
      const callbacks = new Map;
      const proxied = create(null);

      let resolving = '';

      const deadlock = ({ promise }, name) => {
        if (resolving) {
          const t = setTimeout(
            console.warn,
            3e3,
            `💀🔒 - is proxy.${resolving}() awaiting proxy.${name}() ?`
          );
          promise = promise.then(
            result => {
              clearTimeout(t);
              return result;
            },
            error => {
              clearTimeout(t);
              return Promise.reject(error);
            },
          );
        }
        return promise;
      };

      super(url, assign({ type: 'module' }, options)).proxy = new Proxy(proxied, {
        get: (_, name) => {
          // the curse of potentially awaiting proxies in the wild
          // requires this ugly guard around `then`
          if (name === 'then') return;
          let cb = callbacks.get(name);
          if (!cb) {
            callbacks.set(name, cb = (...args) => {
              const [uid, wr] = next();
              channel.postMessage([uid, name, transform ? args.map(transform) : args]);
              return deadlock(wr, name);
            });
          }
          return cb;
        },
        set
      });

      super.postMessage(UID, [port2]);

      // @bug https://bugzilla.mozilla.org/show_bug.cgi?id=1956778
      if (native && UID) {
        super.addEventListener('message', event => {
          const { data } = event;
          if (data?.ID === UID) {
            stop(event);
            channel.onmessage(data);
          }
        });
      }

      channel.onmessage = async ({ data }) => {
        const [i32, name, args] = data;
        const type = typeof i32;
        if (type === 'number')
          resolve(i32, name, args);
        else {
          resolving = name;
          const response = await result(i32, proxied[name], args, transform);
          resolving = '';
          if (type === 'string')
            channel.postMessage(response);
          else {
            const result = response[2] || response[1];
            // at index 1 we store the written length or 0, if undefined
            i32[1] = result === void 0 ? 0 : encode(result, i32.buffer);
            // at index 0 we set the SharedArrayBuffer as ready
            i32[0] = 1;
            notify(i32, 0);
          }
        }
      };
    }
  }

  return {
    Worker,
    native,
  };
};
