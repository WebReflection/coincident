import { MAIN, WORKER } from './constants.js';

import { decoder as jsonDecoder } from '../json/decoder.js';

import coincident from '../worker.js';
import proxyWorker from '../proxy/worker.js';

import minimalDecoder from '../minimal/decoder.js';

/**
 * @callback Coincident
 * @param {import('../worker.js').WorkerOptions} [options]
 * @returns {Promise<{native: boolean, transfer: (...args: Transferable[]) => Transferable[], proxy: {}, window: Window, isWindowProxy: (value: any) => boolean}>}
 */

export default /** @type {Coincident} */ async options => {
  let tracking = false;
  const defaultDecoder = options?.decoder || jsonDecoder;
  const exports = await coincident({
    ...options,
    decoder(options) {
      const original = defaultDecoder(options);
      const minimal = minimalDecoder(options);
      return (length, buffer) => {
        if (tracking) {
          tracking = false;
          return minimal(length, buffer);
        }
        return original(length, buffer);
      };
    }
  });

  const main = exports.proxy[MAIN];

  const { isProxy, global, method } = proxyWorker(
    function (...args) {
      tracking = true;
      return main.apply(this, args);
    },
    options?.transform || ((o) => o)
  );

  // for the time being this is used only to invoke callbacks
  // attached as listeners or as references' fields.
  exports.proxy[WORKER] = method;

  return { ...exports, window: global, isWindowProxy: isProxy };
};
