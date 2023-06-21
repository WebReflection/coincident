import coincident from '../uhtml.js';

const {window, uhtml} = coincident(self);
const {render, html} = uhtml;
const {document} = window;

tick(uhtml);
setInterval(tick, 1000, uhtml);

function tick() {
  render(document.body, html`
    <div>
      <h1>Hello, world!</h1>
      <h2>It is ${new Date().toLocaleTimeString()}.</h2>
    </div>
  `);
}
