#!/usr/bin/env node

const { basename, dirname, join, resolve } = require('path');
const { writeFileSync, readFileSync, statSync } = require('fs');

const { argv } = process;
const args = argv.slice(2);
const cwd = process.cwd();

if (!args.length || args[0] === '--help') help();
else {
  const file = resolve(cwd, args[0]);
  const stats = statSync(dirname(file), {throwIfNoEntry: false});
  if (stats && stats.isDirectory()) {
    writeFileSync(file, readFileSync(join(__dirname, 'dist', 'sw.js')));
    console.log(`Added Service Worker as \x1b[1m${file}\x1b[0m`);
    process.exit(0);
  }
  else {
    console.log('');
    console.log(`  ⚠️  Unable to create \x1b[1m${basename(file)}\x1b[0m in \x1b[1m${dirname(file)}\x1b[0m`);
    help();
    process.exit(1);
  }
}

function help() {
  console.log(
`
  \x1b[7m\x1b[1m  coincident  \x1b[0m

    \x1b[2m# save coincident/sw export as ./public/sw.js\x1b[0m
    coincident ./public/sw.js
`
  );
}
