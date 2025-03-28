import { Encoder } from 'buffered-clone/encoder';

import {
  Atomics,
  MessageChannel,
  Worker as W,
  native
} from 'sabayon/lite/main';

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

const { notify } = Atomics;

// @bug https://bugzilla.mozilla.org/show_bug.cgi?id=1956778
// Note: InstallTrigger is deprecated so once it's gone I do hope
//       this workaround would be gone too!
const ID = 'InstallTrigger' in globalThis ? crypto.randomUUID() : '';

export default options => {
  const { encode } = new Encoder(
    assign({}, options, defaults)
  );

  const deadlock = (wr, resolving, name) => {
    const t = setTimeout(
      console.warn,
      3e3,
      `💀🔒 - is proxy.${resolving}() awaiting proxy.${name}() ?`
    );
    return wr.promise.then(
      result => {
        clearTimeout(t);
        return result;
      },
      error => {
        clearTimeout(t);
        return Promise.reject(error);
      },
    );
  };

  const transform = options?.transform;

  class Worker extends W {
    constructor(url, options) {
      const { port1: channel, port2 } = new MessageChannel;
      const callbacks = new Map;
      const promises = new Map;
      const proxied = create(null);
      let id = 0, resolving = '';
      super(url, assign({ type: 'module' }, options)).proxy = new Proxy(proxied, {
        get: (_, name) => {
          let cb = callbacks.get(name);
          if (!cb) {
            callbacks.set(name, cb = (...args) => {
              const uid = id++;
              const wr = withResolvers();
              promises.set(uid, wr);
              channel.postMessage(
                [uid, name, transform ? args.map(transform) : args],
                transferable(args),
              );
              return resolving ? deadlock(wr, resolving, name) : wr.promise;
            });
          }
          return cb;
        },
        set
      });
      super.postMessage(ID, [port2]);
      channel.onmessage = async ({ data }) => {
        const [i32, name, args] = data;
        if (typeof i32 === 'number') {
          const wr = promises.get(i32);
          promises.delete(i32);
          if (args) wr.reject(args);
          else wr.resolve(name);
        }
        else {
          resolving = name;
          let result;
          try {
            result = await proxied[name](...args);
            if (transform) result = transform(result);
          }
          catch (error) {
            result = error;
          }
          resolving = '';

          // at index 1 we store the written length or 0, if undefined
          i32[1] = result === void 0 ? 0 : encode(result, i32.buffer);
          // at index 0 we set the SharedArrayBuffer as ready
          i32[0] = 1;
          notify(i32, 0);
        }
      };
      // @bug https://bugzilla.mozilla.org/show_bug.cgi?id=1956778
      if (native && ID) {
        super.addEventListener('message', event => {
          const { data } = event;
          if (data?.ID === ID) {
            stop(event);
            channel.onmessage(data);
          }
        });
      }
    }
  }

  return {
    Worker,
    native,
    transfer,
  };
};
