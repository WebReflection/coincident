import coincident from '../../dist/window/worker.js';
const { window } = await coincident();

const { document } = window;

console.log(document.body.outerHTML);
