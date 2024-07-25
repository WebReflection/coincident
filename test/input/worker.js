import coincident from '../../dist/window/worker.js';

const { proxy } = await coincident();

console.log('asking for an input');
// pauses in a non blocking way the worker until the answer has been received
console.log('input', proxy.input('what is 1 + 3 ?'));
console.log('input received');
