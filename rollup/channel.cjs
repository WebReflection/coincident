const {join} = require('node:path');
const {readFileSync, writeFileSync} = require('node:fs');
const {randomUUID} = require('node:crypto');

const INDEX = join(__dirname, '..', 'esm', 'index.js');

writeFileSync(
  INDEX,
  readFileSync(INDEX).toString().replace(
    /const\s+CHANNEL\s*=\s*(['"]).*?\1\s*;?/,
    `const CHANNEL = '${randomUUID()}';`
  )
);
