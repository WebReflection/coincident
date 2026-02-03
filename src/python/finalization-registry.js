// your micropython with gc extras dir
const base = '.';
const { loadMicroPython } = await import(`${base}/micropython.mjs`);
const interpreter = await loadMicroPython({ url: `${base}/micropython.wasm` });

const unique = `_mpy_${Date.now()}`;
interpreter.runPython(`import js;from jsffi import create_proxy as cp;js.${unique}=[id,cp];del js;del cp`);

const [id, create_proxy] = globalThis[unique];
delete globalThis[unique];

const caches = [];

interpreter.registerJsModule('fr', {
  FinalizationRegistry(callback) {
    const c = create_proxy(callback);
    const cache = new Map;
    const registry = {
      register(target, held, token = null) {
        const k = id(target);
        cache.set(k, { c, h: held ?? k, t: token });
      },
      unregister(token) {
        for (const [k, { t }] of cache) {
          if (token === t && t !== null)
            cache.delete(k);
        }
      }
    };
    caches.push(cache);
    return registry;
  }
});

interpreter.registerGcFreeCallback?.(id => {
  for (const cache of caches) {
    for (const [k, { c, h }] of cache) {
      if (k === id) {
        cache.delete(k);
        c(h);
      }
    }
  }
});

// const { src } = document.querySelector('script[type=micropython]');
// interpreter.runPythonAsync(await fetch(src).then(res => res.text()));
