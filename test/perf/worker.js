import coincident from '../../dist/window/worker.js';
// import { decoder } from 'https://esm.run/reflected-ffi/decoder';

const f32a = new Float32Array(2 ** 19);
for (let i = 0; i < f32a.length; i++)
  f32a[i] = Math.random();

const { proxy, window } = await coincident();

console.time('warmup window');
let length = window.roundtrip(f32a).length;
console.timeEnd('warmup window');
console.assert(length === f32a.length);

for (let i = 0; i < 10; i++) window.roundtrip(f32a).length;

console.time('hot window');
length = window.roundtrip(f32a).length;
console.timeEnd('hot window');

console.time('warmup proxy');
length = proxy.roundtrip(f32a).length;
console.timeEnd('warmup proxy');
console.assert(length === f32a.length);

for (let i = 0; i < 10; i++) proxy.roundtrip(f32a).length;

console.time('hot proxy');
length = proxy.roundtrip(f32a).length;
console.timeEnd('hot proxy');
console.assert(length === f32a.length);
