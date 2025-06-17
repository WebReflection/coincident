import coincident from '../../dist/window/main.js';
// import { encoder } from 'https://esm.run/reflected-ffi/encoder';

const { Worker } = coincident();

const worker = new Worker('./worker.js', { type: 'module' });

globalThis.roundtrip = value => value;
worker.proxy.roundtrip = roundtrip;
