import local from 'reflected-ffi/local';
import events from 'reflected-ffi/utils/events';
import { encoder } from 'reflected-ffi/encoder';
import { encode as direct } from 'reflected-ffi/direct/encoder';

import { MAIN, WORKER } from './constants.js';

import coincident from '../main.js';

export default options => {
  const esm = options?.import;
  const defaultEncoder = options?.encoder || encoder;
  const exports = coincident({
    ...options,
    encoder: options => defaultEncoder({ ...options, direct }),
  });

  class Worker extends exports.Worker {
    #terminate;
    constructor(url, options) {
      const { proxy } = super(url, options);

      const { direct, reflect, terminate } = local({
        ...options,
        remote(event) {
          if (event instanceof Event) events(event);
        },
        buffer: true,
        reflect: proxy[WORKER],
        module: options?.import || esm || (name => new URL(name, location.href)),
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
