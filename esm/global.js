import CHANNEL from './channel.js';
import $coincident from './index.js';
import main from './global/main.js';
import thread from './global/thread.js';

const MAIN = CHANNEL + 'M';
const THREAD = CHANNEL + 'T';

const proxies = new WeakMap;

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 * @param {{parse: (serialized: string) => any, stringify: (serializable: any) => string}} [JSON] an optional `JSON` like interface to `parse` or `stringify` content
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
