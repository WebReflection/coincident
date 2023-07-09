import coincident from './server.js';

class DirectEmitter {
  on(type, handler) {
    this[type] = handler;
    return this;
  }
}

class WebSocketServer extends DirectEmitter {
    constructor() {
      super();
      this.connection = null;
    }
  }

class WebSocketClient extends DirectEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
    this.close = null;
    this.message = null;
    this.error = null;
  }
  once(_, handler) {
    this.message = message => {
      this.send(message);
      handler(message);
    };
  }
  send(message) {
    this.ws.send(message);
  }
}

/**
 * @param {object} globals Globals to expose via coincident
 * @returns
 */
export default globals => {
  const sockets = new Map;
  const wss = new WebSocketServer;
  coincident(wss, globals);
  return {
    /**
     * @param {WebSocket} ws
     * @param {string} message
     */
    message(ws, message) {
      sockets.get(ws).message(message);
    },
    /**
     * @param {WebSocket} ws
     */
    open(ws) {
      const wsc = new WebSocketClient(ws);
      sockets.set(ws, wsc);
      wss.connection(wsc);
    },
    /**
     * @param {WebSocket} ws
     */
    close(ws) {
      sockets.get(ws).close();
      sockets.delete(ws);
    },
  };
};
