import BROADCAST_CHANNEL_UID from './bid.js';

import { SharedArrayBuffer as SAB, native } from '@webreflection/utils/shared-array-buffer';
import withResolvers from '@webreflection/utils/with-resolvers';
import nextResolver from 'next-resolver';
import { ID, stop } from '../utils.js';

const { defineProperty } = Object;

const [next, resolve] = nextResolver();
let [bootstrap, promise] = next();

/**
 * @callback sabayon
 * @param {string|URL} [serviceWorkerURL] - The URL of the service worker to register on the main thread.
 * @returns {Promise<void>} - A promise that resolves when the polyfill is ready.
 */

let register = /** @type {sabayon} */(() => promise);

let track = () => {};

let {
  Atomics,
  MessageChannel,
  MessagePort,
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

  // Web Worker
  if ('importScripts' in globalThis) {
    track = view => {
      views.set(view, null);
    };

    const transform = data => {
      const view = data[0];
      const id = ids++;
      views.set(view, id);
      return [id, view, data];
    };

    const _postMessage = postMessage;
    postMessage = function $postMessage(data, transfer) {
      if (ready) {
        const details = { ID: data.ID, data: transform(data.data) };
        _postMessage(details, transfer);
      }
      else promise.then(() => this.postMessage(data, transfer));
    }

    MessagePort = class extends MessagePort {
      postMessage(data, transfer) {
        if (ready) super.postMessage(transform(data), transfer);
        else promise.then(() => this.postMessage(data, transfer));
      }
    }

    addListener(
      globalThis,
      'message',
      event => {
        stop(event);
        resolve(bootstrap, event.data);
      },
      { once: true }
    );

    // <Atomics Patch>
    const { wait } = Atomics;
    const { parse } = JSON;

    const Request = view => {
      const xhr = new XMLHttpRequest;
      xhr.open('POST', `${SW}?sabayon`, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(`["${UID}",${views.get(view)}]`);
      return xhr;
    };

    const Response = (view, xhr) => {
      view.set(parse(xhr.responseText));
      return 'ok';
    };

    Atomics = {
      wait: (view, ..._) => views.has(view) ?
        Response(view, Request(view)) :
        wait(view, ..._)
      ,
    };

    let UID, SW, ready = false, ids = Math.random();

    promise = promise.then(data => {
      [UID, SW] = data;
      ready = true;
    });
  }
  // Main
  else {
    const UID = [ID, Math.random()].join('-').replace(/\W/g, '-');

    const bc = new BroadcastChannel(BROADCAST_CHANNEL_UID);
    bc.onmessage = async event => {
      const [swid, wid, vid] = event.data;
      if (wid === UID) {
        for (const [view, [id, wr]] of views) {
          if (id === vid) {
            await wr.promise;
            let length = view.length;
            while (length-- && !view[length]);
            bc.postMessage([swid, view.slice(0, length + 1)]);
            break;
          }
        }
      }
    };

    const intercept = event => {
      const [id, view, value] = event.data;
      views.set(view, [id, withResolvers()]);
      defineProperty(event, 'data', { value });
    };

    MessageChannel = class extends MessageChannel {
      constructor() {
        super();
        addListener(this.port1, 'message', intercept);
      }
    };

    Worker = class extends Worker {
      /**
       * @param {string | URL} scriptURL 
       * @param {WorkerOptions} options 
       */
      constructor(scriptURL, options) {
        super(scriptURL, options);
        super.postMessage([UID, SW]);
      }
    };

    const { notify } = Atomics;
    Atomics = {
      notify(view, ..._) {
        const details = views.get(view);
        if (details) {
          details[1].resolve();
          return 0;
        }
        // this will throw with a proper error
        return notify(view, ..._);
      },
    };

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
  MessagePort,
  SharedArrayBuffer,
  Worker,
  postMessage,
  register,
  track,
};
