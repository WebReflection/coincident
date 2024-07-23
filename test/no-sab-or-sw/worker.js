import coincident from '../../dist/window/worker.js';
const { proxy, polyfill, sync } = await coincident();

console.table({ polyfill, sync });

proxy.sum = (...args) => args.reduce((p, c) => (p + c), 0);

console.log('worker invoking main', await proxy.href());
