const { join } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const { randomUUID } = require('crypto');

const CHANNEL = join(__dirname, '..', 'src', 'window', 'constants.js');

writeFileSync(
  CHANNEL,
  readFileSync(CHANNEL).toString().replace(
    /const CHANNEL = (['"]).*?\1;/,
    `const CHANNEL = $1${randomUUID().split('-')[0]}$1;`
  )
);

writeFileSync(
  join(__dirname, '..', 'node_modules', 'reflected-ffi', 'src', 'utils', 'debug.js'),
  `export default ${!!process.env.DEBUG};\n`
);
