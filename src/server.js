import proxyServer from './proxy/server.js';

export default options => {
  options.wss.on('connection', ws => {
    const { onclose, onmessage } = proxyServer(ws, options);
    ws.on('close', onclose);
    ws.on('message', onmessage);
  });
};
