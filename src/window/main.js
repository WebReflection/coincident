import { DESTRUCT } from 'js-proxy/traps';
import { DESTROY } from '../proxy/traps.js';

import { MAIN, WORKER } from './constants.js';
import DEBUG from '../debug.js';

import coincident from '../main.js';
import proxyMain from '../proxy/main.js';

export default /** @type {import('../main.js').Coincident} */ options => {
  const esm = options?.import;
  const exports = coincident(options);

  class Worker extends exports.Worker {
    constructor(url, options) {
      const { proxy } = super(url, options);

      proxy[MAIN] = proxyMain(
        // options.import = name => valid(name) && name
        options?.import || esm || (name => new URL(name, location.href)),
        proxy[WORKER]
      );

      if (DEBUG) {
        const debug = proxy[MAIN];
        proxy[MAIN] = (TRAP, ...args) => {
          const destructing = TRAP === DESTRUCT;
          const method = destructing ? console.warn : console.log;
          method('Main before', TRAP, ...args);
          const result = debug(TRAP, ...args);
          if (!destructing) method('Main after', TRAP, result);
          return result;
        };
      }
    }
    terminate() {
      this.proxy[MAIN](DESTROY);
      super.terminate();
    }
  }

  return { ...exports, Worker };
};
