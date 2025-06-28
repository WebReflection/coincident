import { MAIN, WORKER } from './constants.js';

import { decoder as directDecoder } from 'reflected-ffi/decoder';

import remote from 'reflected-ffi/remote';

import coincident from '../worker.js';

/**
 * @callback Coincident
 * @param {import('../worker.js').WorkerOptions} [options]
 * @returns {Promise<{native: boolean, transfer: (...args: Transferable[]) => Transferable[], proxy: {}, window: Window, isWindowProxy: (value: any) => boolean}>}
 */

export default /** @type {Coincident} */ async options => {
  const exports = await coincident({
    ...options,
    decoder: options?.decoder || directDecoder,
  });

  const ffi = remote({
    ...options,
    buffer: true,
    reflect: exports.proxy[MAIN],
    timeout: exports.ffi_timeout,
  });

  exports.proxy[WORKER] = ffi.reflect;

  return {
    ...exports,
    window: ffi.global,
    isWindowProxy: ffi.isProxy,
    ffi: {  
      assign: ffi.assign,
      direct: ffi.direct,
      evaluate: ffi.evaluate,
      gather: ffi.gather,
      query: ffi.query,
    }
  };
};
