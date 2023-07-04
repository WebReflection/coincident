const {createServer} = require('http');
const {join} = require('path');
const {WebSocketServer} = require('ws');
const staticHandler = require('static-handler');
const coincident = require('../../cjs/server.js');
const handler = staticHandler(join(__dirname, '..', '..'), {
  'Access-Control-Allow-Origin': '*',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'cross-origin'
});
const server = createServer(handler);
coincident(new WebSocketServer({server}), {require});
server.listen(8080, () => {
  console.log(`http://localhost:8080/test/server/`);
});
