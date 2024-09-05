import { MAIN_WS, WORKER_WS } from './constants.js';

import coincident from '../window/worker.js';
import proxyWorker from '../proxy/worker.js';

export default async options => {
  const exports = await coincident(options);

  const { isProxy, global, method } = proxyWorker(
    exports.proxy[MAIN_WS],
    options?.transform || ((o) => o)
  );

  exports.proxy[WORKER_WS] = method;

  return { ...exports, server: global, isServerProxy: isProxy };
};
