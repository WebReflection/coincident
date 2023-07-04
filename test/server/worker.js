import coincident from '../../server.js';

const {
  proxy,            // the main thread (UI/DOM) proxy
  window,           // the window reference
  isWindowProxy,    // the window introspection helper
  server,           // the server reference
  isServerProxy,    // the server introspection helper
} = coincident(self);

const os = server.require('os');

window.document.body.innerHTML = `
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
