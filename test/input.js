import coincident from '../uhtml.js';

const {window, uhtml} = coincident(self);
const {render, html} = uhtml;
const {document} = window;

input('', handler);

function input(value, handler) {
  render(document.body, html`
    <div>
      <!-- ensure always one listener as setter to avoid races -->
      <!-- use always same listener reference otherwise -->
      <input value=${value} @input=${[handler, {invoke: 'stopImmediatePropagation'}]} />
      <div>${value}</div>
    </div>
  `);
}

function handler(event) {
  const {value} = event.target;
  console.log(value);
  input(value, handler);
}
