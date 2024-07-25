import coincident from '../../dist/window/worker.js';
const { proxy } = await coincident();

let x = proxy.func();
console.log("len: ", Object.keys(x).length);
