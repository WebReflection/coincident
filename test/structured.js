import coincident from '../structured.js';

const until = coincident(self);

console.log('asking for an input');
// pauses in a non blocking way the worker until the answer has been received
console.log('input', until.input('what is 1 + 3 ?'));
console.log('input received');
