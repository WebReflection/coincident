import coincident from '../../dist/window/main.js';

const { Worker } = coincident();

const worker = new Worker('./worker.js', { type: 'module' });

globalThis.roundtrip = value => value;
worker.proxy.roundtrip = roundtrip;
