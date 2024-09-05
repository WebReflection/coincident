import proxyServer from './proxy/server.js';

export default (options = {}) => {
  const { bun, wss } = options;
  if (bun) {
    const sockets = new WeakMap;
    return {
      open(ws) {
        sockets.set(ws, proxyServer(ws, options));
      },
      close(ws, _, message) {
        sockets.get(ws).onclose(message);
      },
      message(ws, message) {
        sockets.get(ws).onmessage(message);
      }
    };
  }
  else if (wss) wss.on('connection', ws => {
    const { onclose, onmessage } = proxyServer(ws, options);
    ws.prependListener('close', onclose);
    ws.prependListener('message', onmessage);
  });
};
