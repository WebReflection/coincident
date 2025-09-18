import coincident from '../../dist/window/worker.js';

const { proxy } = await coincident();

while (proxy.increment() < 5000);
