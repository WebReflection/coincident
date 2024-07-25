const { existsSync, readdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const TEST = join(__dirname, '..', 'test');
const list = [];

for (const file of readdirSync(TEST)) {
    try {
        if (existsSync(join(TEST, file, 'index.html')))
            list.push(`<a href="./test/${file}/">${file}</a>`);
    }
    catch (_) {}
}

writeFileSync(
    join(__dirname, '..', 'index.html'),
    `<!doctype html>
    <html>
      <head>
        <title>Coincident Tests</title>
      </head>
      <body>
        <ul>
          ${list.map(link => `<li>${link}</li>`).join('\n' + ' '.repeat(10))}
        </ul>
      </body>
    </html>\n`.replace(/^    /gm, '')
);

writeFileSync(
  join(__dirname, '..', 'test', 'index.html'),
  `<!doctype html>
  <html>
    <head>
      <title>Coincident Tests</title>
    </head>
    <body>
      <ul>
        ${list.map(link => `<li>${link.replace('./test/', './')}</li>`).join('\n' + ' '.repeat(10))}
      </ul>
    </body>
  </html>\n`.replace(/^    /gm, '')
);
