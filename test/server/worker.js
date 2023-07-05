import coincident from '../../server.js';

const {
  proxy,            // the main thread (UI/DOM) proxy
  window,           // the window reference
  isWindowProxy,    // the window introspection helper
  server,           // the server reference
  isServerProxy,    // the server introspection helper
} = coincident(self);

const os = await server.import('os');

console.time('Server');
const html = `
  <h1>coincident/server</h1>
  <h2>Platform Info</h2>
  <ul>
    <li>Platform: ${os.platform()}</li>
    <li>Arch: ${os.arch()}</li>
    <li>CPUS: ${os.cpus().length}</li>
    <li>RAM: ${os.totalmem()}</li>
    <li>Free: ${os.freemem()}</li>
  </ul>
`;
console.timeEnd('Server');

console.time('Main');
window.document.body.innerHTML = html;
console.timeEnd('Main');

server.setTimeout(() => { console.log('OK'); }, 1000);
