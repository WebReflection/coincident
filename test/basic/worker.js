import coincident from '../../dist/worker.js';

const { proxy, polyfill } = await coincident();

console.info('worker', { polyfill });

proxy.log = (...args) => {
  console.info('worker', 'log', args);
  return args.join('-');
};

const result = proxy.alert(1, 2, 3);

if (result instanceof Promise)
  console.log('async', await result);
else
  console.log('sync', result);
