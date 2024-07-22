import coincident from '../../dist/window/worker.js';

const { window } = await coincident();

let a = window.Array(1, 2, 3);

console.assert(!Array.isArray(new window.Number(0)));
console.assert(Array.isArray(a));
console.assert(Array.isArray(new window.Array(0)));

console.assert(!window.Array.isArray(new window.Number(0)));
console.assert(window.Array.isArray(a));
console.assert(window.Array.isArray(new window.Array(0)));

console.assert(!window.Array.isArray(new Number(0)));
console.assert(window.Array.isArray(a));
console.assert(window.Array.isArray([0]));

console.assert(!Object.getOwnPropertyDescriptor(Array, 'isArray').enumerable);

console.log([...a]);
window.console.log(a);
console.log.apply(null, [a]);
window.console.log.apply(null, [a]);

a = null;
