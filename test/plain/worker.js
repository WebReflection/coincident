import coincident from '../../dist/worker.js';

const { proxy, native } = await coincident();

proxy.add = (a, b) => a + b;

if (native) console.log('sync', proxy.location());
else console.log('async', await proxy.location());
