import { APPLY } from 'js-proxy/traps';

import { MAIN_WS, WORKER_WS } from './constants.js';

import DEBUG from '../debug.js';

import {
  ACTION_INIT,
  isChannel,
  withResolvers,
} from 'sabayon/shared';

import coincident from '../window/main.js';

class EventWrap {
  constructor(event, data) {
    this._ = event;
    this.$ = data;
  }
  get data() {
    return this.$;
  }
  preventDefault() {
    this._.preventDefault();
  }
  stopImmediatePropagation() {
    this._.stopImmediatePropagation();
  }
}

const { WebSocket } = globalThis;
const { parse: p, stringify: s } = JSON;

export default options => {
  options = { parse: p, stringify: s, ...options };
  const { parse, stringify, ws: websocket } = options;
  const exports = coincident(options);
  class Worker extends exports.Worker {
    #ws = null;
    constructor(url, ...rest) {
      let id = 0;
      const CHANNEL = crypto.randomUUID();
      const messages = new Map;
      const { proxy } = super(url, ...rest);
      const { [WORKER_WS]: __worker__ } = proxy;
      const { promise: wsReady, resolve } = withResolvers();
      const ws = (this.#ws = new WebSocket(websocket));
      if (DEBUG) {
        console.info(`WebSocket created`);
        ws.addEventListener('error', console.error);
      }
      proxy[MAIN_WS] = async (...args) => {
        await wsReady;
        const { promise, resolve } = withResolvers();
        messages.set(id, resolve);
        if (DEBUG) console.log('MAIN_WS processing', [CHANNEL, id, ...args]);
        ws.send(stringify([CHANNEL, id++, ...args]));
        return promise;
      };
      ws.addEventListener('close', () => {
        if (DEBUG) console.info(`Worker ${url} terminated`);
        super.terminate();
      });
      ws.addEventListener('open', () => {
        if (DEBUG) console.log('WebSocket opened');
        ws.send(stringify([CHANNEL, ACTION_INIT]));
      });
      ws.addEventListener('message', async event => {
        if (DEBUG) console.log('WebSocket message', event.data);
        if (!event.data) resolve();
        try {
          const data = parse(event.data);
          if (isChannel(new EventWrap(event, data), CHANNEL)) {
            let [_, id, result] = data;
            // this is for server asking worker to do something
            // directly, without answering any specific callback
            if (id == null) {
              const [TRAP, ref, ...args] = result;
              const apply = TRAP === APPLY;
              if (apply) id = args.pop();
              try {
                result = await __worker__(TRAP, ref, ...args);
              }
              catch (_) {
                result = _;
                if (DEBUG) console.error(_, [TRAP, ref, ...args]);
              }
              if (apply) ws.send(stringify([CHANNEL, null, TRAP, id, result]));
            }
            else {
              if (DEBUG && !messages.has(id))
                console.error(`Unknown ${id} result`, result);
              messages.get(id)(result);
              messages.delete(id);
            }
          }
        }
        catch (_) {}
      });
    }
    terminate() {
      this.#ws.close();
      super.terminate();
    }
  }
  return { ...exports, Worker };
};
