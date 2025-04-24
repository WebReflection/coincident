import coincident from '../../dist/worker_structured.js';
import { set } from '../../src/utils.js';

const D = false;
const BUG = console.log;
const ROUNDTRIPS = 100;

const { proxy, native } = await coincident();

proxy.log = (...args) => {
  console.info('worker', 'log', args);
  return args.join('-');
};

const byteOffset = 8;
const minByteLength = 0xFFFF;
const sab = new SharedArrayBuffer(minByteLength, { maxByteLength: 0x1000000 });
const i32a = new Int32Array(sab);

const proxyDirect = (...args) => {
  postMessage([i32a, `loop${Math.random()}`, args]);
  Atomics.wait(i32a, 0);
  i32a[0] = 0;
  const length = i32a[1];
  const ui16a = new Uint16Array(i32a.buffer, byteOffset, length);
  let json = '', j = 0;
  while (j < length) {
    const next = Math.min(j + minByteLength, length);
    json += String.fromCharCode.apply(null, ui16a.subarray(j, next));
    j = next;
  }
  const result = JSON.parse(json);
  if (result instanceof Error) throw result;
  return result;
};

let result;

setTimeout(async () => {
  for (let invoke, i = 0; i < 1; i++) {
    invoke = proxy.alert('loop', 'cold');
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
}, 500);

setTimeout(async() => {
  for (let invoke, i = 0; i < 1; i++) {
    invoke = proxyDirect('loop', 'cold');
    result = native ? invoke : await invoke;
    D&&BUG(result);
  }
  console.time(`${ROUNDTRIPS} baseline`);
  for (let i = 0; i < ROUNDTRIPS; i++) {
    const invoke = proxyDirect('loop', i, new Uint8Array(8), new Date, new RegExp('test', 'gim'), new Error('test', { cause: 'because' }));
    result = native ? invoke : await invoke;
    D&&BUG(result);
  }
  console.timeEnd(`${ROUNDTRIPS} baseline`);
}, 1500);

// console.log('main:', native ? 'sync' : 'async', result);
