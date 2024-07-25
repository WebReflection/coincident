import coincident from '../../dist/window/worker.js';
const { window } = await coincident();

const parser = new window.DOMParser;

const document = parser.parseFromString(
  '<!doctype html>',
  'text/html'
);

document.body.textContent = 'Hello World';

window.parent.postMessage(document.documentElement.outerHTML);
