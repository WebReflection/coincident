import coincident from '../../dist/window/worker.js';
const { proxy, native } = await coincident();

console.table({ native });

proxy.sum = (...args) => args.reduce((p, c) => (p + c), 0);

console.log('worker invoking main', await proxy.href());
