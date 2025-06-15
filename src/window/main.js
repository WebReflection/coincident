import local from 'reflected-ffi/local';
import patchEvent from 'reflected-ffi/utils/events';
import { encoder as directEncoder } from 'reflected-ffi/direct/encoder';

import { MAIN, WORKER } from './constants.js';

import coincident from '../main.js';

export default options => {
  const esm = options?.import;
  const defaultEncoder = options?.encoder || directEncoder;
  const encoder = options => defaultEncoder({ ...options, buffer: true });
  const exports = coincident({ ...options, encoder });

  /** @type {Worker & { direct: <T>(value: T) => T, proxy: Record<string, function> }} */
  class Worker extends exports.Worker {
    #terminate;
    constructor(url, options) {
      const { proxy } = super(url, options);
      const { direct, reflect, terminate } = local({
        ...options,
        buffer: true,
        reflect: proxy[WORKER],
        remote(event) { if (event instanceof Event) patchEvent(event); },
        module: options?.import || esm || (name => import(new URL(name, location).href)),
      });

      this.#terminate = terminate;
      this.direct = direct;

      proxy[MAIN] = reflect;
    }
    terminate() {
      this.#terminate();
      super.terminate();
    }
  }

  return { ...exports, Worker };
};
