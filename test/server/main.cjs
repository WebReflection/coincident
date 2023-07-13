const {createServer} = require('http');
const {join} = require('path');
const {WebSocketServer} = require('ws');
const {EventEmitter} = require('node:events');
const staticHandler = require('static-handler');
const coincident = require('../../cjs/server.js');
const handler = staticHandler(join(__dirname, '..', '..'), {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin'
});
const server = createServer(handler);
coincident(new WebSocketServer({server}), {
  require,
  import: name => import(name),
  emitter: () => {
    const emitter = new EventEmitter;
    setTimeout(() => { emitter.emit('event', 'emitter', Math.random()); }, 1000);
    return emitter;
  }
});
server.listen(8080, () => {
  console.log(`http://localhost:8080/test/server/`);
});
