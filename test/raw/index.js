import coincident from '../../dist/main.js';
import { encoder } from '../../dist/flatted_encoder.js';

const { Worker, native } = coincident({ encoder });

console.info('main', { native });

const w = new Worker(`./worker.js`, { type: 'module' });

w.proxy.roundtrip = (...args) => {
  console.log('main', ...args);
  return args;
};
