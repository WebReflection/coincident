// (c) Andrea Giammarchi - MIT

import {
  Atomics,
  Int32Array,
  SharedArrayBuffer,
  addEventListener,
  postMessage,
  ignore,
  polyfill,
} from 'sabayon/worker';

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
  withResolvers,
} from './shared.js';

const { wait, waitAsync } = Atomics;

/**
 * @typedef {Object} WorkerOptions
 * @prop {(text: string, ...args:any) => any} [parse=JSON.parse]
 * @prop {(value: any, ...args:any) => string} [stringify=JSON.stringify]
 * @prop {(value: any) => any} [transform]
 * @prop {{handler: () => void, timeout?: number}} [interrupt]
 */

/**
 * @callback Coincident
 * @param {WorkerOptions} [options]
 * @returns {Promise<{polyfill: boolean, sync: boolean, transfer: (...args: Transferable[]) => Transferable[], proxy: {}}>}
 */

export default /** @type {Coincident} */ ({
  parse,
  stringify,
  transform,
  interrupt,
} = JSON) => {
  const waitLength = actionLength(stringify, transform);

  const ready = withResolvers();
  const map = new Map;
  const results = new Map;

  let CHANNEL = '';
  let waitSync = wait;
  if (wait && interrupt) {
    const { handler, timeout = 42 } = interrupt;
    waitSync = (sb, index, result) => {
      while ((result = wait(sb, index, 0, timeout)) === 'timed-out')
        handler();
      return result;
    };
  }

  addEventListener('message', event => {
    if (isChannel(event, CHANNEL)) {
      const [_, ACTION, ...rest] = event.data;
      switch (ACTION) {
        case ACTION_INIT: {
          const sync = !!wait;
          CHANNEL = _;
          ready.resolve({
            polyfill,
            sync,
            transfer,
            proxy: createProxy(
              [
                CHANNEL,
                bytes => new Int32Array(new SharedArrayBuffer(bytes)),
                ignore,
                sync,
                parse,
                polyfill,
                postMessage,
                transform,
                sync ?
                  (...args) => ({ value: { then: fn => fn(waitSync(...args)) } }) :
                  waitAsync,
              ],
              map,
            ),
          });
          break;
        }
        case ACTION_WAIT: {
          // give the code a chance to finish running (serviceWorker mode)
          if (!map.size) setTimeout(actionWait, 0, waitLength, results, map, rest);
          else actionWait(waitLength, results, map, rest);
          break;
        }
        case ACTION_NOTIFY: {
          actionFill(results, rest);
          break;
        }
      }
    }
  });

  return ready.promise;
};
