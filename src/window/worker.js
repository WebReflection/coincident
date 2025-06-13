import { MAIN, WORKER } from './constants.js';

import remote from 'reflected-ffi/remote';
import { decoder } from 'reflected-ffi/decoder';
import { decode as direct } from 'reflected-ffi/direct/decoder';

import coincident from '../worker.js';

/**
 * @callback Coincident
 * @param {import('../worker.js').WorkerOptions} [options]
 * @returns {Promise<{native: boolean, transfer: (...args: Transferable[]) => Transferable[], proxy: {}, window: Window, isWindowProxy: (value: any) => boolean}>}
 */

export default /** @type {Coincident} */ async options => {
  let decoderOptions;
  const exports = await coincident({
    ...options,
    decoder: options => (options?.decoder || decoder)(
      (decoderOptions = { ...options, direct })
    ),
  });

  // recycle always the same DataView reference ... a bit awkward but
  // I cannot know upfront how to wrap the shared buffer in this case
  if (exports.native) {
    decoderOptions.dataView = new DataView(
      exports.view.buffer,
      decoderOptions.byteOffset || 0,
    );
  }

  const ffi = remote({ ...options, reflect: exports.proxy[MAIN] });

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
