import { readFileSync, writeFileSync } from 'node:fs';

const main = readFileSync('./src/main.js', 'utf-8').toString();
const worker = readFileSync('./src/worker.js', 'utf-8').toString();
const basic = readFileSync('./test/basic/worker.js', 'utf-8').toString();

const variant = kind => {
  console.log(`creating ${kind}`);
  writeFileSync(`./src/main_${kind}.js`, main.replace(/\.\/[^/]+?\/encoder\.js/, `./${kind}/encoder.js`));
  writeFileSync(`./src/worker_${kind}.js`, worker.replace(/\.\/[^/]+?\/decoder\.js/, `./${kind}/decoder.js`));
  writeFileSync(`./test/basic/worker_${kind}.js`, basic.replace('../../dist/worker.js', `../../dist/worker_${kind}.js`));
};

variant('buffered');
variant('json');
variant('flatted');
variant('structured');
