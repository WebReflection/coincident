import coincident from '../../dist/window/main.js';

const { Worker } = coincident();

new Worker('./worker.js', { type: 'module', serviceWorker: '../sw.js' });
