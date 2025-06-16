import coincident from '../../dist/server/worker.js';

console.time('coincident(Worker)');
const { server, window, ffi } = await coincident();
console.timeEnd('coincident(Worker)');

console.log('coincident', 'Worker');
window.console.log('coincident', 'Main');
server.console.log('coincident', 'Server');

console.time('server.import("os")');
const os = await server.import('os');
console.timeEnd('server.import("os")');


console.time('Server');
const [
  platform,
  arch,
  cpus,
  totalmem,
  freemem,
] = [ // ffi.server.evaluate(os =>
  os.platform(),
  os.arch(),
  os.cpus().length,
  os.totalmem(),
  os.freemem(),
]; // , os);
console.timeEnd('Server');


console.time('window.import("uhtml")');
const { render, html } = await window.import('https://esm.run/uhtml');
console.timeEnd('window.import("uhtml")');

console.time('Main');
render(window.document.body, html`
  <h1>coincident/server</h1>
  <h2>Platform Info</h2>
  <ul>
    <li>Platform: ${platform}</li>
    <li>Arch: ${arch}</li>
    <li>CPUS: ${cpus}</li>
    <li>RAM: ${totalmem}</li>
    <li>Free: ${freemem}</li>
  </ul>
`);
console.timeEnd('Main');

const { process } = server;
process
  .once('client', value => {
    console.log('client', value);
  })
  .emit('client', Math.random())
;
