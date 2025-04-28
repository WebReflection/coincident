import coincident from '../../dist/window/worker.js';

const { window } = await coincident();
const { document } = window;

document.body.textContent = 'Testing ...';

document.addEventListener(
  'click',
  event => {
    document.body.textContent = event.type + 'ed';
  },
  { once: true }
);

document.body.click();
