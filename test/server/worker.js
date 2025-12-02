import coincident from '../../dist/server/worker.js';

console.time('coincident(Worker)');
const { server: python, window } = await coincident();
console.timeEnd('coincident(Worker)');

console.log('coincident', 'Worker');
window.console.log('coincident', 'Main');
python.print('-'.repeat(80));
python.print('coincident', 'Server', '🥳');
python.print('-'.repeat(80));

console.time('python.import("sys")');
const sys = python.import('sys');
console.timeEnd('python.import("sys")');
console.log(sys.version);

const js = {a: 123};
const py = python.dict(js);

console.log(js, py);
console.log(
  'python server dictionary',
  py.a,
  py['a'],
  py.__class__.__name__,
);
