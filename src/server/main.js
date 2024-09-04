import { APPLY } from 'js-proxy/traps';

import { MAIN_WS, WORKER_WS } from './constants.js';

import DEBUG from '../debug.js';

import {
  ACTION_INIT,
  isChannel,
  withResolvers,
} from 'sabayon/shared';

const { WebSocket } = globalThis;
const { parse: p, stringify: s } = JSON;
const { create } = Object;

export default options => {
  const exports = coincident(options);
  const { parse = p, stringify = s } = options;
  class Worker extends exports.Worker {
    #ws = null;
    constructor(url, options) {
      let id = 0;
      const CHANNEL = crypto.randomUUID();
      const messages = new Map;
      const { proxy } = super(url, options);
      const { [WORKER_WS]: __worker__ } = proxy;
      const { promise: wsReady, resolve } = withResolvers();
      const ws = (this.#ws = new WebSocket(options.ws));
      proxy[MAIN_WS] = async (...args) => {
        await wsReady;
        const { promise, resolve } = withResolvers();
        messages.set(id, resolve);
        ws.send(stringify([CHANNEL, id++, ...args]));
        return promise;
      };
      if (DEBUG) ws.addEventListener('error', console.error);
      ws.addEventListener('close', () => {
        if (DEBUG) console.info(`Worker ${url} terminated`);
        super.terminate();
      });
      ws.addEventListener('open', () => {
        ws.send(stringify([CHANNEL, ACTION_INIT]));
      });
      ws.addEventListener('message', async event => {
        if (!event.data) resolve();
        try {
          const value = parse(event.data);
          if (isChannel(create(event, { data: { value } }), CHANNEL)) {
            let [_, id, result] = value;
            // this is for server asking worker to do something
            // directly, without answering any specific callback
            if (id == null) {
              const [TRAP, ref, ...args] = data;
              const apply = TRAP === APPLY;
              if (apply) id = args.shift();
              let result;
              try {
                result = await __worker__(TRAP, ref, ...args);
              }
              catch (_) {
                if (DEBUG) console.log(`Failed to invoke`, [TRAP, ref, ...args]);
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
