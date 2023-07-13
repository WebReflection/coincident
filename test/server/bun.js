import { serve, file } from 'bun';
import { EventEmitter } from 'events';
import coincidentWS from '../../esm/bun.js';

const port = 8080;
const headers =  {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

serve({
  port,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    let path = '.' + new URL(req.url).pathname;
    if (path.endsWith('/')) path += 'index.html';
    return new Response(file(path), {headers});
  },
  websocket: coincidentWS({
    import: name => import(name),
    emitter: () => {
      const emitter = new EventEmitter;
      setTimeout(() => { emitter.emit('event', 'emitter', Math.random()); }, 1000);
      return emitter;
    }
  }),
});

console.log(`http://localhost:${port}/test/server/`);
