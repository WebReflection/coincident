import { DESTRUCT } from 'js-proxy/traps';

import { MAIN, WORKER } from './constants.js';
import DEBUG from '../debug.js';

import coincident from '../worker.js';
import proxyWorker from '../proxy/worker.js';

/**
 * @callback Coincident
 * @param {import('../worker.js').WorkerOptions} [options]
 * @returns {Promise<{polyfill: boolean, sync: boolean, transfer: (...args: Transferable[]) => Transferable[], proxy: {}, window: Window, isWindowProxy: (value: any) => boolean}>}
 */

export default /** @type {Coincident} */ async options => {
  const exports = await coincident(options);

  const { isProxy, global, method } = proxyWorker(
    exports.proxy[MAIN],
    options?.transform || ((o) => o)
  );

  // for the time being this is used only to invoke callbacks
  // attached as listeners or as references' fields.
  exports.proxy[WORKER] = method;

  if (DEBUG) {
    const debug = exports.proxy[WORKER];
    exports.proxy[WORKER] = (TRAP, ...args) => {
      const destructing = TRAP === DESTRUCT;
      const method = destructing ? console.warn : console.log;
      method('Worker before', TRAP, ...args);
      const result = debug(TRAP, ...args);
      if (!destructing) method('Worker after', TRAP, result);
      return result;
    };
  }

  return { ...exports, window: global, isWindowProxy: isProxy };
};
