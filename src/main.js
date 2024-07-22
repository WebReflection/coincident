// (c) Andrea Giammarchi - MIT

import {
  Atomics,
  Int32Array,
  SharedArrayBuffer,
  Worker as $Worker,
  ignore,
  polyfill,
} from 'sabayon/main';

import {
  ACTION_INIT,
  ACTION_WAIT,
  ACTION_NOTIFY,

  actionLength,
  actionFill,
  actionWait,

  createProxy,

  isChannel,
  transfer,
} from './shared.js';

/**
 * @typedef {Object} MainOptions
 * @prop {(text: string, ...args:any) => any} [parse=JSON.parse]
 * @prop {(value: any, ...args:any) => string} [stringify=JSON.stringify]
 * @prop {(value: any) => any} [transform]
 */

/**
 * @callback Coincident
 * @param {MainOptions} [options]
 * @returns {{Worker: import('./ts.js').CoincidentWorker, polyfill: boolean, transfer: (...args: Transferable[]) => Transferable[]}}
 */

export default /** @type {Coincident} */ ({
  parse,
  stringify,
  transform,
} = JSON) => {
  const waitLength = actionLength(stringify, transform);

  const CHANNEL = crypto.randomUUID();

  class Worker extends $Worker {
    constructor(url, options) {
      const map = new Map;
      super(url, options);
      this.proxy = createProxy(
        [
          CHANNEL,
          Int32Array,
          SharedArrayBuffer,
          ignore,
          false,
          parse,
          polyfill,
          (...args) => this.postMessage(...args),
          transform,
          Atomics.waitAsync,
        ],
        map,
      );
      this.postMessage(ignore([CHANNEL, ACTION_INIT, options]));
      this.addEventListener('message', event => {
        if (isChannel(event, CHANNEL)) {
          const [_, ACTION, ...rest] = event.data;
          switch (ACTION) {
            case ACTION_WAIT: {
              actionWait(waitLength, map, rest);
              break;
            }
            case ACTION_NOTIFY: {
              actionFill(...rest);
              break;
            }
          }
        }
      });
    }
  }

  return {
    Worker,
    polyfill,
    transfer,
  };
};
