import nextResolver from 'next-resolver';

import { MAIN_WS, WORKER_WS } from './constants.js';
import { encode, decode } from './direct.js';
import coincident from '../window/main.js';

const { WebSocket } = globalThis;


export default options => {
  const { ws: websocket } = options;
  const exports = coincident(options);

  /** @type {Worker & { direct: <T>(value: T) => T, proxy: Record<string, function> }} */
  class Worker extends exports.Worker {
    #ws = null;
    constructor(url, options) {
      const { proxy } = super(url, options);
      const [ next, resolve ] = nextResolver(Number);
      const [uid, opened] = next();
      const worker = proxy[WORKER_WS];
      const ws = (this.#ws = new WebSocket(websocket));
      ws.onerror = console.error;
      ws.onclose = () => super.terminate();
      ws.onopen = () => {
        ws.send(encode([MAIN_WS]));
        resolve(uid);
      };
      ws.onmessage = async event => {
        const data = decode(await event.data.arrayBuffer());
        if (typeof data[0] === 'number')
          resolve.apply(null, data);
        else {
          try {
            data[1] = await worker(...data[1]);
          }
          catch(error) {
            data[1] = null;
            data[2] = error;
          }
          ws.send(encode(data));
        }
      };
      proxy[MAIN_WS] = async (...args) => {
        await opened;
        const [uid, promise] = next();
        ws.send(encode([uid, args]));
        return promise;
      };
    }
    terminate() {
      this.#ws.close();
      super.terminate();
    }
  }
  return { ...exports, Worker };
};
