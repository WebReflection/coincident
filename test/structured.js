import coincident from '../structured.js';

const until = coincident(self);

const result = until.input('what is 1 + 3 ?');
console.log('result', result);

console.assert(typeof result.bigInt === 'bigint');
