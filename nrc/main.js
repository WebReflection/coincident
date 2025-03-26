import {
  Atomics,
  MessageChannel,
  Worker as W,
  native
} from 'sabayon/lite/main';

import { Encoder } from 'buffered-clone/encoder';

import { assign, create, defaults, set, withResolvers } from './utils.js';

const { notify } = Atomics;

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
      let id = 0;
      super(...args).proxy = new Proxy(proxy, {
        get: (_, name) => {
          let cb = callbacks.get(name);
          if (!cb) {
            callbacks.set(name, cb = async (...args) => {
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
      port1.onmessage = async ({ data }) => {
        const [sab, name, args] = data;
        if (typeof sab === 'number') {
          const wr = promises.get(sab);
          if (args) wr.reject(args);
          else wr.resolve(name);
        }
        else {
          let result;
          try {
            result = await proxy[name](...args);
            if (transform) result = transform(result);
          }
          catch (error) { result = error }
          const i32a = new Int32Array(sab);
          // at index 1 we store the written length or 0, if undefined
          i32a[1] = result === void 0 ? 0 : encode(result, sab);
          // at index 0 we just notify the whole thing is done
          i32a[0] = 1;
          notify(i32a, 0);
        }
      };
      super.postMessage(null, [port2]);
    }
  }

  return {
    Worker,
    native,
  };
};
