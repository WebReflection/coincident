import BROADCAST_CHANNEL_UID from './bid.js';

import { SharedArrayBuffer as SAB, native } from '@webreflection/utils/shared-array-buffer';
import withResolvers from '@webreflection/utils/with-resolvers';
import nextResolver from 'next-resolver';
import { ID } from '../utils.js';

const { isArray } = Array;
const { isView } = ArrayBuffer;
const { defineProperty, values } = Object;

const [next, resolve] = nextResolver();
let [bootstrap, promise] = next();

/**
 * @callback sabayon
 * @param {string|URL} [serviceWorkerURL] - The URL of the service worker to register on the main thread.
 * @returns {Promise<void>} - A promise that resolves when the polyfill is ready.
 */

let register = /** @type {sabayon} */(() => promise);

let {
  Atomics,
  MessageChannel,
  SharedArrayBuffer,
  Worker,
  postMessage,
} = globalThis;

if (native) resolve(bootstrap);
else {
  SharedArrayBuffer = SAB;

  const views = new Map;

  const addListener = (target, ...args) => {
    target.addEventListener(...args);
  };

  const extend = (target, literal) => {
    for (const key in literal) {
      literal[key] = {
        value: literal[key],
        configurable: true,
        writable: true,
      };
    }
    return Object.create(target, literal);
  };

  // Web Worker
  if ('importScripts' in globalThis) {
    const intercept = (set, data, view) => {
      if (view && typeof view === 'object' && !set.has(view)) {
        set.add(view);
        if (isView(view)) {
          // avoid DataView or other views to be considered for waiting
          if (view instanceof Int32Array && view.buffer instanceof SharedArrayBuffer) {
            const id = ids++;
            views.set(view, id);
            return [UID, id, view, data];
          }
        }
        else {
          const array = isArray(view) ? view : values(view);
          for (let i = 0; i < array.length; i++) {
            const details = intercept(set, data, array[i]);
            if (details) return details;
          }
        }
      }
    };

    const interceptor = method => function postMessage(data, ...rest) {
      if (ready) {
        const details = intercept(new Set, data, data);
        method.call(this, (details || data), ...rest);
      }
      else {
        promise.then(() => postMessage(data, ...rest));
      }
    };

    postMessage = interceptor(postMessage);

    const { prototype } = globalThis.MessagePort;
    prototype.postMessage = interceptor(prototype.postMessage);

    addListener(
      globalThis,
      'message',
      event => {
        let { data } = event;
        // console.log('sabayon', data);
        if (isArray(data) && typeof data.at(1) === 'string')
          event.stopImmediatePropagation();
        resolve(bootstrap, data);
      },
      { once: true }
    );

    // <Atomics Patch>
    const { wait } = Atomics;
    const { parse } = JSON;

    const Async = value => ({ value, async: true });

    const Request = (view, sync) => {
      const xhr = new XMLHttpRequest;
      xhr.open('POST', `${SW}?sabayon`, sync);
      xhr.send(`["${UID}",${views.get(view)}]`);
      return xhr;
    };

    const Response = (view, xhr) => {
      view.set(parse(xhr.responseText));
      views.delete(view);
      return 'ok';
    };

    Atomics = extend(Atomics, {
      wait: (view, ..._) => views.has(view) ?
        Response(view, Request(view, false)) :
        wait(view, ..._)
      ,
      waitAsync: (view, ..._) => {
        if (views.has(view)) {
          const { promise, resolve } = withResolvers();
          const xhr = Request(view, true);
          xhr.onloadend = () => resolve(Response(view, xhr));
          return Async(promise);
        }
        return wait(view, ..._);
      },
    });

    let UID, SW, ready = false, ids = Math.random();

    promise = promise.then(data => {
      [UID, SW] = data;
      ready = true;
    });
  }
  // Main
  else {
    const UID = ID;

    const bc = new BroadcastChannel(BROADCAST_CHANNEL_UID);
    bc.onmessage = async event => {
      const [swid, wid, vid] = event.data;
      if (wid === UID) {
        for (const [view, [id, wr]] of views) {
          if (id === vid) {
            await wr.promise;
            views.delete(view);
            let length = view.length;
            while (length-- && !view[length]);
            bc.postMessage([swid, view.slice(0, length + 1)]);
            break;
          }
        }
      }
    };

    const interceptData = event => {
      let { data } = event;
      if (isArray(data) && data.at(0) === UID) {
        const [_, id, view, value] = data;
        views.set(view, [id, withResolvers()]);
        defineProperty(event, 'data', { value });
      }
    };

    MessageChannel = class extends MessageChannel {
      constructor() {
        super();
        addListener(this.port1, 'message', interceptData);
        addListener(this.port2, 'message', interceptData);
      }
    };

    Worker = class extends Worker {
      /**
       * @param {string | URL} scriptURL 
       * @param {WorkerOptions} options 
       */
      constructor(scriptURL, options) {
        super(scriptURL, options);
        if (SW) {
          super.postMessage([UID, SW]);
          addListener(this, 'message', interceptData);
        }
      }
    };

    const { notify } = Atomics;
    Atomics = Object.create(Atomics, {
      notify: {
        configurable: true,
        writable: true,
        value: (view, ..._) => {
          const details = views.get(view);
          if (details) {
            details[1].resolve();
            return 0;
          }
          return notify(view, ..._);
        },
      },
    });

    let SW = '';
    let serviceWorker = null;

    /**
     * @param {ServiceWorkerContainer} swc
     * @param {RegistrationOptions} [options]
     */
    const activate = (swc, options) => {
      let w, c = true;
      swc.getRegistration(SW)
        .then(r => (r ?? swc.register(SW, options)))
        .then(function ready(r) {
          const { controller } = swc;
          c = c && !!controller;
          w = (r.installing || r.waiting || r.active);
          if (w.state === 'activated') {
            if (c) {
              // allow ServiceWorker swap on different URL
              if (controller.scriptURL === SW)
                return resolve(bootstrap);
              r.unregister();
            }
            location.reload();
          }
          else {
            addListener(w, 'statechange', () => ready(r), { once: true });
          }
        });
    };

    register = /** @type {sabayon} */((serviceWorkerURL, options) => {
      if (!serviceWorker) {
        // resolve the fully qualified URL for Blob based workers
        SW = new URL(serviceWorkerURL, location.href).href;
        activate(navigator.serviceWorker, options);
        serviceWorker = promise;
      }
      return serviceWorker;
    });
  }
}

export {
  Atomics,
  MessageChannel,
  SharedArrayBuffer,
  Worker,
  postMessage,
  register,
};
