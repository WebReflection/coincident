import coincident from '../../es.js';
const proxy = coincident(self);

let x = proxy.func();
console.log("len: ", Object.keys(x).length);
