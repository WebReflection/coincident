import * as structured from '../dist/structured.js';
import * as flatted from '../dist/flatted.js';
import * as buffered from '../dist/buffered.js';

const recursive = { a: 1, b: 2, c: 3 };
recursive.d = recursive;
const data = {
  recursive,
  strings: [
    "this is a string",
    "this is a string",
    "this is a string",
    "this is a string",
    "this is a string",
    "this is a string",
    "this is a string",
    "this is a string",
    "this is a string",
    "this is a string",
  ],
  numbers: Array.from({ length: 10 }, () => Math.random()),
  list: [
    new Map([[recursive, { some: 'value' }]]),
    new Set([recursive, { some: 'value' }]),
    new Uint8Array(8),
    new Date,
    new RegExp('test', 'gim'),
  ]
};

console.log('structured', structured.encode(data).length);
console.log('flatted', flatted.encode(data).length);
console.log('buffered', buffered.encode(data).length);

console.time('structured');
structured.decode(structured.encode(data))
console.timeEnd('structured');

console.time('flatted');
flatted.decode(flatted.encode(data))
console.timeEnd('flatted');

console.time('buffered');
buffered.decode(buffered.encode(data))
console.timeEnd('buffered');

const evil = structured.decode('[[1,[1,2]],[0,9],[-1]]');
console.log(evil, buffered.decode(buffered.encode(evil)));
