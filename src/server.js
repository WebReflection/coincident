import server from './server/server.js';

export default (options = {}) => {
  const { bun, wss } = options;
  const sockets = new Map;
  if (bun) {
    return {
      open(ws) {
        sockets.set(ws, server(ws, options));
      },
      close(ws, _, message) {
        const coincident = sockets.get(ws);
        sockets.delete(ws);
        coincident.onclose(message);
      },
      message(ws, message) {
        sockets.get(ws).onmessage(message);
      }
    };
  }
  else if (wss) wss.on('connection', ws => {
    const coincident = server(ws, options);
    sockets.set(ws, coincident);
    ws.prependListener('close', (...args) => {
      sockets.delete(ws);
      coincident.onclose(...args);
    });
    ws.prependListener('message', coincident.onmessage);
  });
  return {
    direct(value) {
      for (const coincident of sockets.values())
        coincident.direct(value);
      return value;
    },
    sockets,
  };
};
