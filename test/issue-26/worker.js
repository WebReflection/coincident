console.log('worker.js');

import coincident from '../../dist/window/worker.js';
const { proxy } = await coincident();

console.time('loop');
for (let i = 0; i < 10000; i++)
  proxy.func();
console.timeEnd('loop');

console.log('DONE');
