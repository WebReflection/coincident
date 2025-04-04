import coincident from '../../dist/main.js';

const { Worker } = coincident();

const worker = new Worker('./worker.js');

worker.proxy.location = () => location.href;

await worker.proxy.add(1, 2);
