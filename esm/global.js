import CHANNEL from './channel.js';
import $coincident from './index.js';
import main from './global/main.js';
import thread from './global/thread.js';

const MAIN = CHANNEL + 'M';
const THREAD = CHANNEL + 'T';

const proxies = new WeakMap;

/**
 * @typedef {object} Coincident
 * @property {ProxyHandler<globalThis>} proxy
 * @property {ProxyHandler<Window>} global
 * @property {(value: any) => boolean} isGlobal
 */

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * In workers, returns a `{proxy, global, isGlobal}` namespace to reach globals synchronously.
 * @param {Worker | globalThis} self the context in which code should run
 * @returns {ProxyHandler<Worker> | Coincident}
 */
const coincident = (self, ...args) => {
  const proxy = $coincident(self, ...args);
  if (!proxies.has(proxy)) {
    const util = self instanceof Worker ? main : thread;
    proxies.set(proxy, util(proxy, MAIN, THREAD));
  }
  return proxies.get(proxy);
}

coincident.transfer = $coincident.transfer;

export default coincident;
