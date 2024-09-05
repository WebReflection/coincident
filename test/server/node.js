import { join } from 'path';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import staticHandler from 'static-handler';
import coincident from '../../src/server.js';

const server = createServer(
  staticHandler(
    join(import.meta.dirname, '..', '..'),
    {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-origin'
    }
  )
);

coincident({
  wss: new WebSocketServer({ server })
});

server.listen(8080, () => {
  console.log(`http://localhost:8080/test/server/`);
});
