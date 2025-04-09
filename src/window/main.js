import { DESTROY } from '../proxy/traps.js';

import { encoder as jsonEncoder } from '../json/encoder.js';

import { MAIN, WORKER } from './constants.js';

import coincident from '../main.js';
import callback from '../proxy/main.js';

import minimalEncoder from '../minimal/encoder.js';

export default /** @type {import('../main.js').Coincident} */ options => {
  let tracking = false;
  const esm = options?.import;
  const defaultEncoder = options?.encoder || jsonEncoder;
  const exports = coincident({
    ...options,
    encoder(options) {
      const original = defaultEncoder(options);
      const minimal = minimalEncoder(options);
      return (value, buffer) => {
        if (tracking) {
          tracking = false;
          return minimal(value, buffer);
        }
        return original(value, buffer);
      };
    }
  });

  class Worker extends exports.Worker {
    constructor(url, options) {
      const { proxy } = super(url, options);

      const main = callback(
        // options.import = name => valid(name) && name
        options?.import || esm || (name => new URL(name, location.href)),
        proxy[WORKER]
      );

      proxy[MAIN] = function (...args) {
        const result = main.apply(this, args);
        tracking = result !== void 0;
        return result;
      };
    }
    terminate() {
      this.proxy[MAIN](DESTROY);
      super.terminate();
    }
  }

  return { ...exports, Worker };
};
