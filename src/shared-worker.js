// (c) Andrea Giammarchi - MIT

import {
  Atomics,
  Int32Array,
  SharedArrayBuffer,
  ignore,
  polyfill,
} from 'sabayon-shared-worker/shared-worker';

import {
  ACTION_INIT,
  ACTION_WAIT,
  ACTION_NOTIFY,

  actionLength,
  actionFill,
  actionWait,

  createProxy,

  isChannel,
  withResolvers,
} from './shared.js';

export default ({
  parse,
  stringify,
  transform,
} = JSON) => {
  const waitLength = actionLength(stringify, transform);
  const proxies = new WeakMap;
  addEventListener('connect', ({ ports }) => {
    for (const port of ports) {
      let CHANNEL = '';
      const map = new Map;
      const results = new Map;
      const { promise, resolve } = withResolvers();
      proxies.set(port, promise);
      port.addEventListener('message', event => {
        if (isChannel(event, CHANNEL)) {
          const [_, ACTION, ...rest] = event.data;
          switch (ACTION) {
            case ACTION_INIT: {
              CHANNEL = _;
              resolve(
                createProxy(
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
                )
              );
              break;
            }
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
      port.start();
    }
  });

  return proxies;
};
