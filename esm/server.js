import {MAIN, THREAD} from './channel.js';
import {assign} from './shared/utils.js';
import $coincident from './structured.js';
import JSON from './json.js';
import main from './window/main.js';
import thread from './window/thread.js';
import serverMain from './server/main.js';
import serverThread from './server/thread.js';

const SERVER_MAIN = 'S' + MAIN;
const SERVER_THREAD = 'S' + THREAD;

const {parse, stringify} = JSON;

const isServer = !!globalThis.process;
const proxies = new WeakMap;

/**
 * @typedef {object} Coincident
 * @property {ProxyHandler<globalThis>} proxy
 * @property {ProxyHandler<Window>} window
 * @property {(value: any) => boolean} isWindowProxy
 */

/**
 * @typedef {object & Coincident} CoincidentWorker
 * @property {ProxyHandler<globalThis>} proxy
 * @property {ProxyHandler<Window>} window
 * @property {(value: any) => boolean} isWindowProxy
 * @property {ProxyHandler<NodeJS>} server
 * @property {(value: any) => boolean} isServerProxy
 */

/**
 * @callback CoincidentServer
 * @param {WebSocketServer} wss the WebSocketServer to use to handle Worker/Server calls
 * @param {object} [globals] optional globals to expose through the Worker via the proxy
 * @returns {WebSocketServer}
 */

/**
 * @callback CoincidentWeb
 * @param {globalThis | Worker} self either the main thread (Worker)or a worker (in main thread UI)
 * @param  {WebSocket} [ws] the optional WebSocket to use when `self` is `globalThis` 
 * @returns {Coincident | CoincidentWorker}
 */

const coincident = isServer ?
  /** @type {CoincidentServer} */
  (wss, globals) => wss.on('connection', ws => {
    const util = serverMain(
      {[SERVER_THREAD]: (...args) => {
        ws.send('!' + stringify(args));
      }},
      SERVER_MAIN,
      SERVER_THREAD,
      globals
    );
    const __main__ = util.proxy[SERVER_MAIN];
    ws.on('message', data => {
      ws.send(stringify(__main__(...parse(data))));
    });
  }) :

  /** @type {CoincidentWeb} */
  (self, ws) => {
    const proxy = $coincident(self);
    if (!proxies.has(proxy)) {
      const util = self instanceof Worker ? mainBridge : threadBridge;
      proxies.set(proxy, util(proxy, MAIN, THREAD, ws));
    }
    return proxies.get(proxy);
  }
;

if (!isServer)
  coincident.transfer = $coincident.transfer;

export default coincident;

const mainBridge = (thread, MAIN, THREAD, ws) => {
  const {[SERVER_THREAD]: __thread__} = thread;
  let resolve;
  ws.addEventListener('message', async ({data}) => {
    const isThread = data.startsWith('!');
    const result = parse(isThread ? data.slice(1) : data);
    isThread ? __thread__(...result) : (resolve = resolve(result));
  });
  thread[SERVER_MAIN] = (...args) => new Promise($ => {
    resolve = $;
    ws.send(stringify(args));
  });
  return main(thread, MAIN, THREAD);
};

const threadBridge = (proxy, MAIN, THREAD) => assign(
  serverThread(proxy, SERVER_MAIN, SERVER_THREAD),
  thread(proxy, MAIN, THREAD)
);
