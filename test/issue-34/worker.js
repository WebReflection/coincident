import coincident from '../../dist/window/worker.js';
const { window } = await coincident();

let { array, object } = window;

console.log(Array.isArray(array));
console.log(Object.keys(array), [...array]);
array.push(4);
console.log(Object.keys(array), [...array]);
console.log(Object.keys(object), {...object});

array = null;
object = null;
