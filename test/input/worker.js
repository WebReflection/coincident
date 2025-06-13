import coincident from '../../dist/window/worker.js';

const { proxy, window, ffi } = await coincident();

console.log('asking for an input');

let result;
// pauses in a non blocking way the worker until the answer has been received
console.log('input', result = proxy.input('what is 1 + 3 ?'));
console.log('input received');

ffi.query(window, 'document.body').append(result);
