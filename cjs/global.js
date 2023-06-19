'use strict';
const CHANNEL = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('./channel.js'));
const $coincident = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('./index.js'));
const main = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('./global/main.js'));
const thread = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('./global/thread.js'));

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

module.exports = coincident;
