import coincident from '../../dist/worker.js';

const D = false;
const BUG = console.log;

const { proxy, native } = await coincident();

proxy.log = (...args) => {
  console.info('worker', 'log', args);
  return args.join('-');
};

let result;
for (let i = 0; i < 1; i++) {
  const invoke = proxy.alert('loop', 'cold');
  result = native ? invoke : await invoke;
  D&&BUG(result);
}

console.time('10 roundtrip');
for (let i = 0; i < 10; i++) {
  const invoke = proxy.alert('loop', i);
  result = native ? invoke : await invoke;
  D&&BUG(result);
}
console.timeEnd('10 roundtrip');

console.log('main:', native ? 'sync' : 'async', result);
