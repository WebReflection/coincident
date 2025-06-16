import coincident from '../../dist/window/main.js';

const { Worker } = coincident();

const { proxy } = new Worker('./worker.js', { type: 'module' });

proxy.location = () => new Float32Array([1, 2, 3]);

console.log('async main', await proxy.add(1, 2));
