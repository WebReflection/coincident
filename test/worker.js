import coincident from '../window.js';

const until = coincident(self).proxy;

console.log('asking for an input');
// pauses in a non blocking way the worker until the answer has been received
console.log('input', until.input('what is 1 + 3 ?'));
console.log('input received');
