import coincident from '../window.js';

const {window} = coincident(self);

const a = window.Array(1, 2);
console.log(Array.isArray(new window.Number(0)));
console.log(Array.isArray(a), Array.isArray(new window.Array(0)));

console.log(window.Array.isArray(new window.Number(0)));
console.log(window.Array.isArray(a), window.Array.isArray(new window.Array(0)));

console.log(window.Array.isArray(new Number(0)));
console.log(window.Array.isArray(a), window.Array.isArray([0]));

console.log(Object.getOwnPropertyDescriptor(Array, 'isArray'));

console.log.apply(null, [a]);
window.console.log.apply(null, [a]);
