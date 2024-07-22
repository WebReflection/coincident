import coincident from '../../dist/window/main.js';

const { Worker } = coincident();

new Worker('./worker.js', { serviceWorker: '../sw.js' });
