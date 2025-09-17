// import coincident from '../../dist/window/worker.js';
import coincident from 'https://cdn.jsdelivr.net/npm/coincident@4.0.26/dist/window/worker.js';
const { proxy, native, sync, window } = await coincident();

console.table({ native, sync });

proxy.sum = (...args) => args.reduce((p, c) => (p + c), 0);

console.log(
  'worker invoking main',
  sync ? 'synchronously' : 'asynchronously',
  sync ? proxy.href() : await proxy.href()
);

window?.document?.body?.append('OK ');
