// import * as JSON from '../node_modules/@ungap/structured-clone/esm/json.js';
import coincident from '../uhtml.js';

const {window, uhtml} = coincident(self, JSON);
const {render, html} = uhtml;
const {document} = window;

const log = event => {
  console.log(event.type, 'hello there');
};

tick(uhtml);
setInterval(tick, 1000, uhtml);

function tick() {
  render(document.body, html`
    <div .onclick=${({type}) => console.log(type)}>
      <h1 @click=${[log, {invoke: 'stopImmediatePropagation'}]}>Hello, world!</h1>
      <h2>It is ${new Date().toLocaleTimeString()}.</h2>
    </div>
  `);
}
