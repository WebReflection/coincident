import {
  Atomics,
  MessageChannel,
  Worker as W,
  native
} from 'sabayon/lite/main';

import { Encoder } from 'buffered-clone/encoder';

import { assign, create, defaults, set, stop, withResolvers } from './utils.js';

const { notify } = Atomics;

// @bug https://bugzilla.mozilla.org/show_bug.cgi?id=1956778
const ID = typeof InstallTrigger === 'object' ? crypto.randomUUID() : '';

export default options => {
  const { encode } = new Encoder(
    assign({}, options, defaults)
  );

  const transform = options?.transform;

  class Worker extends W {
    constructor(...args) {
      const { port1, port2 } = new MessageChannel;
      const callbacks = new Map;
      const promises = new Map;
      const proxy = create(null);
      let id = 0, resolving = false;
      super(...args).proxy = new Proxy(proxy, {
        get: (_, name) => {
          let cb = callbacks.get(name);
          if (!cb) {
            callbacks.set(name, cb = async (...args) => {
              if (resolving) throw new SyntaxError(`💀🔒 - proxy.${name}(...args)`);
              const uid = id++;
              const wr = withResolvers();
              promises.set(uid, wr);
              port1.postMessage([uid, name, transform ? args.map(transform) : args]);
              return wr.promise;
            });
          }
          return cb;
        },
        set
      });
      super.postMessage(ID, [port2]);
      port1.onmessage = async ({ data }) => {
        const [i32, name, args] = data;
        if (typeof i32 === 'number') {
          const wr = promises.get(i32);
          promises.delete(i32);
          if (args) wr.reject(args);
          else wr.resolve(name);
        }
        else {
          let result;
          resolving = true;
          try {
            result = await proxy[name](...args);
            if (transform) result = transform(result);
          }
          catch (error) { result = error }
          resolving = false;

          // at index 1 we store the written length or 0, if undefined
          i32[1] = result === void 0 ? 0 : encode(result, i32.buffer);
          // at index 0 we just notify the whole thing is done
          i32[0] = 1;
          notify(i32, 0);
        }
      };
      // @bug https://bugzilla.mozilla.org/show_bug.cgi?id=1956778
      if (native && ID) {
        super.addEventListener('message', event => {
          const { data } = event;
          if (data?.id === ID) {
            stop(event);
            port1.onmessage(data);
          }
        });
      }
    }
  }

  return {
    Worker,
    native,
  };
};
