import server from './server/server.js';

export default (options = {}) => {
  const { bun, wss } = options;
  const sockets = new Map;
  const ffi = {
    assign(value, ...rest) {
      for (const coincident of sockets.values())
        coincident.ffi.assign(value, ...rest);
      return value;
    },
    evaluate(...args) {
      for (const coincident of sockets.values())
        coincident.ffi.evaluate(...args);
      return value;
    },
    direct(value) {
      for (const coincident of sockets.values())
        coincident.ffi.direct(value);
      return value;
    },
  };

  if (bun) {
    return {
      ffi,
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

  return { ffi, sockets };
};
