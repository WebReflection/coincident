import coincident from '../global.js';

const {global} = coincident(self);
globalThis.document = global.document;

import('./hyperhtml.mjs').then(({bind}) => {
  const html = bind(document.body);
  const handler = event => {
    const {value} = event.target;
    console.log(value);
    input(html, value, handler);
  };
  input(html, '', handler);
});

function input(html, value, handler) {
  html`
    <div>
      <input value="${value}" oninput="${handler}" />
      <div>${value}</div>
    </div>
  `;
}
