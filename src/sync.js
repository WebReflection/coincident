import coincident from './main.js';

const url = href => new URL(href, location.href);

const { href: worker } = new URL('./worker.js', import.meta.url);
const { assign, keys } = Object;
const modules = new Map;

let main;

export default (module, options) => {
  const justInit = typeof module !== 'string';
  main ??= coincident(justInit ? module : options);
  if (justInit) return main;
  const { Worker } = main;
  const { href } = url(module);
  let tw, known = modules.get(href);
  if (!known) {
    const id = crypto.randomUUID();
    const { promise, resolve } = Promise.withResolvers();
    if (options?.worker) {
      const tb = new Blob([
        `import coincident from '${worker}';`,
        `import * as $ from '${href}';`,
        `const{assign:a,keys:k}=Object,{proxy:p}=await coincident();`,
        `a(p,$);p['${id}'](k($))`,
      ], { type: 'text/javascript' });
      const tu = URL.createObjectURL(tb);
      promise.then(() => URL.revokeObjectURL(tu));
      tw = new Worker(tu, { ...options, type: 'module' });
      tw.proxy[id] = resolve;
    }
    else {
      tw = { proxy: null, terminate(){ this.proxy = null } };
      import(href).then($ => resolve(keys((tw.proxy = $))));
    }
    known = {
      terminate: () => {
        modules.delete(href);
        tw.terminate();
      },
      for(source) {
        const sb = new Blob([
          `import coincident from '${worker}';`,
          `const{proxy:p}=await coincident();globalThis.sync={};`,
          `for(let k of p.keys())sync[k]=(...a)=>p.invoke(k,a);`,
          `await import('${url(source)}')`,
        ], { type: 'text/javascript' });
        const su = URL.createObjectURL(sb);
        const sw = new Worker(su, { ...options, type: 'module' });
        sw.proxy.keys = () => promise;
        sw.proxy.invoke = (k, args) => tw.proxy[k](...args);
        return {
          terminate: () => {
            URL.revokeObjectURL(su);
            sw.terminate();
          },
        };
      }
    };
    modules.set(href, assign(known, main));
  }
  return known;
};
