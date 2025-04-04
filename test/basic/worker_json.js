import coincident from '../../dist/worker_json.js';

const D = false;
const BUG = console.log;
const ROUNDTRIPS = 20;

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

console.time(`${ROUNDTRIPS} roundtrip`);
for (let i = 0; i < ROUNDTRIPS; i++) {
  const invoke = proxy.alert('loop', i, new Uint8Array(8), new Date, new RegExp('test', 'gim'), new Error('test', { cause: 'because' }));
  result = native ? invoke : await invoke;
  D&&BUG(result);
}
console.timeEnd(`${ROUNDTRIPS} roundtrip`);

console.log('main:', native ? 'sync' : 'async', result);
