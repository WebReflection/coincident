import coincident from '../window.js';

const {window} = coincident(self);

// neededd as global in hyperHTML module
globalThis.document = window.document;

import('./hyperhtml.mjs').then(({bind}) => {
  const html = bind(document.body);
  tick(html);
  setInterval(tick, 1000, html);
});

function tick(html) {
  html`
    <div>
      <h1>Hello, world!</h1>
      <h2>It is ${new Date().toLocaleTimeString()}.</h2>
    </div>
  `;
}
