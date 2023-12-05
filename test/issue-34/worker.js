import coincident from '../dist/window.js';
const { window } = coincident(self);

const { array, object } = window;

console.log(Array.isArray(array));
console.log(Object.keys(array), [...array]);
array.push(4);
console.log(Object.keys(array), [...array]);
console.log(Object.keys(object), {...object});
