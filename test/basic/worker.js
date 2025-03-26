import coincident from '../../dist/worker.js';

const { proxy, native } = await coincident();

proxy.log = (...args) => {
  console.info('worker', 'log', args);
  return args.join('-');
};

let result;
for (let i = 0; i < 1; i++) {
  const invoke = proxy.alert(1, 2, 3);
  result = native ? invoke : await invoke;
}

console.time('10 roundtrip');
for (let i = 0; i < 10; i++) {
  const invoke = proxy.alert(1, 2, 3);
  result = native ? invoke : await invoke;
}
console.timeEnd('10 roundtrip');

console.log(native ? 'sync' : 'async', result);
