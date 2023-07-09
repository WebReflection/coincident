import coincident from '../../server.js';

const {window, server} = coincident(self);

const os = await server.import('os');
const {Database} = await server.import('bun:sqlite');

const db = new Database(":memory:");

console.time('query');
const {message} = db.query("select 'Hello world' as message;").get();
console.timeEnd('query');

const html = `
  <h1>coincident/bun</h1>
  <h2>SQLite Message</h2>
  <p>
    ${message}
  </p>
`;

console.time('html');
window.document.body.innerHTML = html;
console.timeEnd('html');
