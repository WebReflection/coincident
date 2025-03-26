import coincident from '../../dist/main.js';

const { Worker, native } = coincident();

console.info('main', { native });

const w = new Worker('./worker.js', { type: 'module' });

w.proxy.alert = (...args) => {
  console.info('main', 'alert', args);
  return args.join('-');
};

console.log('async', await w.proxy.log(4, 5, 6));
