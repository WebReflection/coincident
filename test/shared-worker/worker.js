import coincident from '../../dist/window/worker.js';
const { window, isWindowProxy } = await coincident();

const { document } = window;

console.log(document.body.outerHTML);
