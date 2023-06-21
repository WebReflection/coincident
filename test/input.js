import coincident from '../global.js';
import uhtml from './uhtml.mjs';

const {global} = coincident(self);
const {render, html} = uhtml(global);
const {document} = global;

input('');

function input(value) {
  render(document.body, html`
    <div>
      <!-- ensure always one listener as setter to avoid races -->
      <!-- use always same listener reference otherwise -->
      <input value="${value}" .oninput="${event => {
        const {value} = event.target;
        console.log(value);
        input(value);
      }}" />
      <div>${value}</div>
    </div>
  `);
}
