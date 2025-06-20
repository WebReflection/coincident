import coincident from '../../dist/window/worker.js';
const { proxy, native, sync } = await coincident();

console.table({ native, sync });

proxy.sum = (...args) => args.reduce((p, c) => (p + c), 0);

console.log(
  'worker invoking main',
  sync ? 'synchronously' : 'asynchronously',
  sync ? proxy.href() : await proxy.href()
);
