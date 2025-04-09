import { DESTROY } from '../proxy/traps.js';

import { encoder as jsonEncoder } from '../json/encoder.js';

import { MAIN, WORKER } from './constants.js';

import coincident from '../main.js';
import callback from '../proxy/main.js';

import minimalEncoder from '../minimal/encoder.js';

export default /** @type {import('../main.js').Coincident} */ options => {
  let tracking = null;
  const esm = options?.import;
  const encoder = options?.encoder || jsonEncoder;
  const exports = coincident({
    ...options,
    encoder(options) {
      const original = encoder(options);
      const minimal = minimalEncoder(options);
      return (value, buffer) => {
        if (tracking === value) {
          tracking = null;
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
        return (tracking = main.apply(this, args));
      };
    }
    terminate() {
      this.proxy[MAIN](DESTROY);
      super.terminate();
    }
  }

  return { ...exports, Worker };
};
