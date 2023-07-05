import '@ungap/with-resolvers';
import {MAIN, THREAD} from './channel.js';
import {APPLY} from './shared/traps.js';
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

const parseData = data => {
  let id;
  if (/^!(-?\d+)?/.test(data)) {
    id = RegExp.$1;
    data = data.slice(1 + id.length);
  }
  return {id, result: data ? parse(data) : void 0};
};

const coincident = isServer ?
  /** @type {CoincidentServer} */
  (wss, globals) => {
    let id = 0, ws = null;
    const resolvers = new Map;
    const util = serverMain(
      {[SERVER_THREAD]: async (trap, ...args) => {
        const data = stringify([trap, ...args]);
        if (trap === APPLY) {
          const {promise, resolve} = Promise.withResolvers();
          const uid = String(id++);
          resolvers.set(uid, resolve);
          ws.send('!' + uid + data);
          return await promise;
        }
        ws.send('!' + data);
      }},
      SERVER_MAIN,
      SERVER_THREAD,
      globals
    );
    const __main__ = util.proxy[SERVER_MAIN];
    return wss.on('connection', $ws => {
      if (ws !== null) return $ws.close();
      ws = $ws
        .on('close', () => {
          ws = null;
          for (const [_, resolve] of resolvers) resolve();
          resolvers.clear();
        })
        .on('message', buffer => {
          const {id, result} = parseData(String(buffer));
          if (id) {
            const resolve = resolvers.get(id);
            resolvers.delete(id);
            resolve(result);
          }
          else
            ws.send(stringify(__main__(...result)));
        });
    });
  } :

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
  let resolve;
  const {[SERVER_THREAD]: __thread__} = thread;
  ws.addEventListener('message', async ({data}) => {
    const {id, result} = parseData(data);
    if (id != null) {
      const invoke = __thread__(...result);
      if (id) {
        const out = await invoke;
        ws.send('!' + id + (out === void 0 ? '' : stringify(out)));
      }
    }
    else
      resolve = resolve(result);
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
