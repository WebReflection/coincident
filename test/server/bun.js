import { serve, file } from 'bun';

import coincident from '../../src/server.js';

const port = 8080;
const headers =  {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

serve({
  port,
  websocket: coincident({ bun: true }),
  fetch(req, server) {
    if (server.upgrade(req)) return;
    let path = '.' + new URL(req.url).pathname;
    if (path.endsWith('/')) path += 'index.html';
    return new Response(file(path), {headers});
  },
});

console.log(`http://localhost:${port}/test/server/`);
