import coincident from '../../dist/server/worker.js';

console.time('coincident(Worker)');
const { server, window } = await coincident();
console.timeEnd('coincident(Worker)');

console.log('coincident', 'Worker');
window.console.log('coincident', 'Main');
server.console.log('coincident', 'Server');

console.time('server.import("os")');
const os = await server.import('os');
console.timeEnd('server.import("os")');

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

const { process } = server;
process.on('client', value => {
  console.log('client', value);
});
process.emit('client', Math.random());
