import coincident from '../../dist/main.js';

const { Worker, native } = coincident();

console.info('main', { native });

const w = new Worker(`./worker.js`, { type: 'module' });

w.proxy.roundtrip = (...args) => {
  console.log('main', ...args);
  return args;
};
