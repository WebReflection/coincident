import coincident from '../../dist/window/worker.js';

const { proxy, native } = await coincident();

proxy.add = (a, b) => a + b;

if (native) console.log('sync worker', proxy.location());
else console.log('async worker', await proxy.location());
