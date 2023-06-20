const {join} = require('node:path');
const {readFileSync, writeFileSync} = require('node:fs');
const {randomUUID} = require('node:crypto');

const CHANNEL = join(__dirname, '..', 'esm', 'channel.js');

writeFileSync(
  CHANNEL,
  readFileSync(CHANNEL).toString().replace(
    /(['"]).*?\1/,
    `$1${randomUUID()}$1`
  )
);
