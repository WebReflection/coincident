import { MAIN, WORKER } from './constants.js';

import coincident from '../worker.js';
import proxyWorker from '../proxy/worker.js';

/**
 * @callback Coincident
 * @param {import('../worker.js').WorkerOptions} [options]
 * @returns {Promise<{native: boolean, transfer: (...args: Transferable[]) => Transferable[], proxy: {}, window: Window, isWindowProxy: (value: any) => boolean}>}
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

  return { ...exports, window: global, isWindowProxy: isProxy };
};
