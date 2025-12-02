const RUNTIME = 'mpy'; // py does not work 🤷

import coincident from '../../dist/server/worker.js';

const { server, window } = await coincident();
const { document } = window;

const { mpy: { value: code } } = window.document.querySelector('script[mpy]').attributes;
const python = await fetch(code).then(res => res.text());

let interpreter;
if (RUNTIME === 'py') {
  // Pyodide interpreter
  const base = 'https://cdn.jsdelivr.net/npm/pyodide@latest';
  const { loadPyodide } = await import(`${base}/pyodide.mjs`);
  interpreter = await loadPyodide();
}
else {
  // MicroPython interpreter
  const base = 'https://cdn.jsdelivr.net/npm/@micropython/micropython-webassembly-pyscript@latest';
  const { loadMicroPython } = await import(`${base}/micropython.mjs`);
  interpreter = await loadMicroPython({ url: `${base}/micropython.wasm` });
}

const wrap = value => (
  typeof value === 'function' ? (...args) => value(...args) : value
);

const imports = new Map;

interpreter.registerJsModule('server', new Proxy({}, {
  get: (_, name) => {
    if (!imports.has(name)) {
      const value = server[name];
      if (value)
        imports.set(name, wrap(value));
      else {
        const module = server.import(name);
        imports.set(name, new Proxy({}, {
          get: (_, prop) => wrap(Reflect.get(module, prop)),
        }));
      }
    }
    return imports.get(name);
  },
}));

interpreter.registerJsModule('pyscript', {
  window,
  document,
  js_import: name => window.import(name),
  // better though ...
  module: {
    main: name => window.import(name),
    worker: name => import(name),
  },
});

interpreter.runPythonAsync(python);
