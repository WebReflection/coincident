import coincident from '../../dist/server/main.js';
const { Worker } = coincident({
  ws: `ws://${location.host}/`
});

new Worker('./runtime.js');
// new Worker('./worker.js');
