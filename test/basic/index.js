import coincident from '../../dist/main.js';

const { Worker, polyfill } = coincident();

console.info('main', { polyfill });

const w = new Worker('./worker.js', { serviceWorker: '../sw.js' });

w.proxy.alert = (...args) => {
  console.info('main', 'alert', args);
  return args.join('-');
};

console.log('async', await w.proxy.log(4, 5, 6));
