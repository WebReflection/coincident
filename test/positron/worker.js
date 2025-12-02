import coincident from '../../dist/server/worker.js';

console.time('coincident(Worker)');
const { server: python, window } = await coincident();
console.timeEnd('coincident(Worker)');

console.log('coincident', 'Worker');

// uses the main thread console
window.console.log('coincident', 'Main');

// or the main thread DOM
window.document.body.append('Hello World');

// prints on the server, not on the browser console
python.print('-'.repeat(80));
python.print('coincident', 'Server', '🥳');
python.print('-'.repeat(80));

// import server module example
console.time('python.import("sys")');
const sys = python.import('sys');
console.timeEnd('python.import("sys")');
console.log(sys.version);

console.log(python.import('os').getcwd());

// python server dictionary example
const js = {a: 123};

// it's a proxy of a real dictionary on the server
const py = python.dict(js);

console.log(js, py);
console.log(
  'python server dictionary',
  // in JS there's no distinction
  py.a,                   // 123
  py['a'],                // 123
  py.__class__.__name__,  // dict
);
