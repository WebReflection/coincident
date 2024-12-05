// (c) Andrea Giammarchi - MIT

import {
  Atomics,
  Int32Array,
  SharedArrayBuffer,
  SharedWorker as $SharedWorker,
  Worker as $Worker,
  ignore,
  polyfill,
} from 'sabayon-shared-worker/main';

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

  const bootstrap = (port, options) => {
    const CHANNEL = crypto.randomUUID();
    const map = new Map;
    const results = new Map;
    port.addEventListener('message', event => {
      if (isChannel(event, CHANNEL)) {
        const [_, ACTION, ...rest] = event.data;
        switch (ACTION) {
          case ACTION_WAIT: {
            actionWait(waitLength, results, map, rest);
            break;
          }
          case ACTION_NOTIFY: {
            actionFill(results, rest);
            break;
          }
        }
      }
    });
    port.postMessage(ignore([CHANNEL, ACTION_INIT, options]));
    return createProxy(
      [
        CHANNEL,
        bytes => new Int32Array(new SharedArrayBuffer(bytes)),
        ignore,
        false,
        parse,
        polyfill,
        (...args) => port.postMessage(...args),
        transform,
        Atomics.waitAsync,
      ],
      map,
    );
  }

  class SharedWorker extends $SharedWorker {
    constructor(url, options) {
      const { port } = super(url, options);
      port.start();
      this.proxy = bootstrap(port, options);
    }
  }

  class Worker extends $Worker {
    constructor(url, options) {
      super(url, options);
      this.proxy = bootstrap(this, options);
    }
  }

  return {
    SharedWorker,
    Worker,
    polyfill,
    transfer,
  };
};
