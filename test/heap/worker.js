import coincident from '../../dist/window/worker.js';
const { window } = await coincident();

let refs = {
  document: window.document,
  navigator: window.navigator,
};

refs.document.body.textContent = refs.navigator.userAgent;

delete refs.document;
delete refs.navigator;

refs = null;
