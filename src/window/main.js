import local from 'reflected-ffi/local';
import patchEvent from 'reflected-ffi/utils/events';
import { encoder as directEncoder } from 'reflected-ffi/encoder';

import { MAIN, WORKER } from './constants.js';

import coincident from '../main.js';
import { ffi_timeout } from '../utils.js';

export default options => {
  const esm = options?.import;
  const timeout = ffi_timeout(options);
  const exports = coincident({
    ...options,
    encoder: options?.encoder || directEncoder,
  });

  /** @type {Worker & { proxy: Record<string, function> }} */
  class Worker extends exports.Worker {
    #terminate;

    constructor(url, options) {
      const { proxy } = super(url, options);
      const ffi = local({
        ...options,
        buffer: true,
        reflect: proxy[WORKER],
        timeout: ffi_timeout(options, timeout),
        remote(event) { if (event instanceof Event) patchEvent(event); },
        module: options?.import || esm || (name => import(new URL(name, location).href)),
      });

      this.#terminate = ffi.terminate;

      this.ffi = {  
        assign: ffi.assign,
        direct: ffi.direct,
        evaluate: ffi.evaluate,
        gather: ffi.gather,
        query: ffi.query,
      };

      proxy[MAIN] = ffi.reflect;
    }

    terminate() {
      this.#terminate();
      super.terminate();
    }
  }

  return { ...exports, Worker };
};
