import { MAIN, WORKER } from './window/constants.js';

import nextResolver from 'next-resolver';

import { encoder } from 'reflected-ffi/encoder';

import * as transferred from './transfer.js';

import * as sabayon from './sabayon/index.js';

import {
  ID,
  assign,
  create,
  defaults,
  native,
  result,
  set,
  stop,
} from './utils.js';

// @bug https://bugzilla.mozilla.org/show_bug.cgi?id=1956778
// Note: InstallTrigger is deprecated so once it's gone I do hope
//       this workaround would be gone too!
const UID = 'InstallTrigger' in globalThis ? ID : '';

const Number = value => value;

const info = name => {
  if (name === MAIN) return 'main';
  if (name === WORKER) return 'worker';
  return name;
};

export default options => {
  const transform = options?.transform;
  const encode = (options?.encoder || encoder)(defaults);
  const checkTransferred = options?.transfer !== false;

  /** @type {Worker & { proxy: Record<string, function> }} */
  class Worker extends sabayon.Worker {
    constructor(url, options) {
      const serviceWorker = !native && options?.serviceWorker;
      const { notify } = serviceWorker ? sabayon.Atomics : Atomics;
      const { port1: channel, port2 } = new (
        serviceWorker ? sabayon.MessageChannel : MessageChannel
      );
      const [ next, resolve ] = nextResolver(Number);
      const callbacks = new Map;
      const proxied = create(null);
      const OK = native ? UID : ID;

      if (serviceWorker) sabayon.register(serviceWorker);

      let resolving = '';

      const deadlock = (promise, name) => {
        if (resolving) {
          const t = setTimeout(
            console.warn,
            3e3,
            `💀🔒 - is proxy.${info(resolving)}() awaiting proxy.${info(name)}() ?`
          );
          promise = promise.then(
            result => {
              clearTimeout(t);
              return result;
            },
            error => {
              clearTimeout(t);
              return Promise.reject(error);
            },
          );
        }
        return promise;
      };

      super(url, assign({ type: 'module' }, options));

      this.proxy = new Proxy(proxied, {
        get: (_, name) => {
          // the curse of potentially awaiting proxies in the wild
          // requires this ugly guard around `then`
          if (name === 'then') return;
          let cb = callbacks.get(name);
          if (!cb) {
            callbacks.set(name, cb = (...args) => {
              const transfer = transferred.get(checkTransferred, args);
              const [uid, promise] = next();
              channel.postMessage(
                [uid, name, transform ? args.map(transform) : args],
                transfer
              );
              return deadlock(promise, name);
            });
          }
          return cb;
        },
        set
      });

      super.postMessage([OK, !!serviceWorker], [port2]);

      // @bug https://bugzilla.mozilla.org/show_bug.cgi?id=1956778
      if (OK) {
        super.addEventListener('message', event => {
          const { data } = event;
          if (data?.ID === OK) {
            stop(event);
            channel.onmessage(data);
          }
        });
      }

      channel.onmessage = async ({ data }) => {
        const i32 = data[0];
        const type = typeof i32;
        if (type === 'number')
          resolve.apply(null, data);
        else {
          resolving = data[1];
          await result(data, proxied, transform);
          resolving = '';
          if (type === 'string')
            channel.postMessage(data);
          else {
            const result = data[2] || data[1];
            // at index 1 we store the written length or 0, if undefined
            i32[1] = result === void 0 ? 0 : encode(result, i32.buffer);
            // at index 0 we set the SharedArrayBuffer as ready
            i32[0] = 1;
            notify(i32, 0);
          }
        }
      };
    }
  }

  return {
    Worker,
    native,
    transfer: transferred.set,
  };
};
