import coincident from '../dist/window.js';

const {window} = coincident(self);
const parser = new window.DOMParser;

const document = parser.parseFromString(
  '<!doctype html>',
  'text/html'
);

document.body.textContent = 'Hello World';

window.parent.postMessage(document.documentElement.outerHTML);
