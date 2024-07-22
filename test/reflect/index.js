import coincident from '../../dist/window/main.js';

const { Worker } = coincident();

new Worker('./worker.js', { serviceWorker: '../sw.js' });

globalThis.test = {
    a: 1,
    b: 2,
};
