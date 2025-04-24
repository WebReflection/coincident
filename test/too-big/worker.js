import coincident from '../../dist/window/worker.js';
const { proxy } = await coincident({ maxByteLength: 0x2000000 });

let x = proxy.func();
console.log("len: ", Object.keys(x).length);
