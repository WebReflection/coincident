console.log('worker.js');

import coincident from '../../es.js';
const proxy = coincident(self);

for (let i = 0; i < 100000; i++)
  proxy.func();

console.log('DONE');
