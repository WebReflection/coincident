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
import Worker from './shared/worker.js';

const {notify, wait} = Atomics;
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
  (wss, globals) => wss.on('connection', ws => {
    // wait for the cross-hand-shake from the main thread
    ws.once('message', buffer => {
      let id = 0;
      const [SERVER_MAIN, SERVER_THREAD] = parse(buffer);
      const resolvers = new Map;
      // bootstrap a dedicated channel for this socket
      const {[SERVER_MAIN]: __main__} = serverMain(
        {[SERVER_THREAD]: async (trap, ...args) => {
          const data = stringify([trap, ...args]);
          // allow return values from thread's callbacks
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
      ).proxy;
      // setup the socket and terminate the hand-shake
      ws
        // resolve dangling promises on close
        .on('close', () => {
          for (const [_, resolve] of resolvers) resolve();
        })
        // resolve or forward results
        .on('message', buffer => {
          const {id, result} = parseData(String(buffer));
          if (id) {
            const resolve = resolvers.get(id);
            resolvers.delete(id);
            resolve(result);
          }
          else
            ws.send(stringify(__main__(...result)));
        })
        // end cross-hand-shake
        .send('');
    });
  }) :

  /** @type {CoincidentWeb} */
  (self, ws, ...args) => {
    const proxy = $coincident(self, ...args);
    if (!proxies.has(proxy)) {
      const util = self instanceof Worker ? mainBridge : threadBridge;
      proxies.set(proxy, util(self, proxy, MAIN, THREAD, ws));
    }
    return proxies.get(proxy);
  }
;

if (!isServer)
  coincident.transfer = $coincident.transfer;

export default coincident;

const mainBridge = (self, thread, MAIN, THREAD, ws) => {
  // wait for the cross-hand-shake from the worker
  self.addEventListener('message', ({data: [CHANNEL, i32]}) => {
    const SERVER_MAIN = 'M' + CHANNEL;
    const SERVER_THREAD = 'T' + CHANNEL;
    const {[SERVER_THREAD]: __thread__} = thread;
    let resolve;
    thread[SERVER_MAIN] = (...args) => new Promise($ => {
      resolve = $;
      ws.send(stringify(args));
    });
    // wait for the cross-hand-shake from the server
    ws.addEventListener('message', () => {
      // setup regular listener for all socket's interactions
      ws.addEventListener('message', async ({data}) => {
        const {id, result} = parseData(data);
        if (id != null) {
          const invoke = __thread__(...result);
          if (id) {
            const out = await invoke;
            ws.send('!' + id + (out === void 0 ? '' : stringify(out)));
          }
        }
        else if (resolve) resolve = resolve(result);
      });
      // unlock the Worker now that all channels have been defined
      i32[0] = 1;
      notify(i32, 0);
    }, {once: true});
    ws.send(stringify([SERVER_MAIN, SERVER_THREAD]));
  }, {once: true});
  return main(thread, MAIN, THREAD);
};

const threadBridge = (self, proxy, MAIN, THREAD) => {
  // create a unique channel to reflect on the server
  // through the main WebSocket (cross-hand-shake)
  const CHANNEL = 'S' + crypto.randomUUID();
  const i32 = new Int32Array(new SharedArrayBuffer(4));
  self.postMessage([CHANNEL, i32]);
  wait(i32, 0);
  // merge server and worker namespace
  return assign(
    serverThread(proxy, 'M' + CHANNEL, 'T' + CHANNEL),
    thread(proxy, MAIN, THREAD)
  );
};
