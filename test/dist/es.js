const FUNCTION  = 'function';

// ⚠️ AUTOMATICALLY GENERATED - DO NOT CHANGE
const CHANNEL = '44d49378-13e1-44d3-8c09-7cfcab2ed2ee';

const GET                          = 'get';
const HAS                          = 'has';
const SET                          = 'set';

// (c) Andrea Giammarchi - MIT

const ACTION_INIT = 0;
const ACTION_NOTIFY = 1;
const ACTION_WAIT = 2;
const ACTION_SW = 3;

const { ArrayBuffer, Atomics: $Atomics, Promise: Promise$1 } = globalThis;
const { isArray: isArray$1 } = Array;
const { create, getPrototypeOf, values } = Object;

const TypedArray = getPrototypeOf(Int32Array);
const Atomics$1 = create($Atomics);

const dispatch = ({ currentTarget, type, origin, lastEventId, source, ports }, data) =>
  currentTarget.dispatchEvent(new MessageEvent(type, { data, origin, lastEventId, source, ports }));

const withResolvers = () => Promise$1.withResolvers();

let id = 0;
const views = new Map;
const extend = (Class, SharedArrayBuffer) => class extends Class {
  constructor(value, ...rest) {
    super(value, ...rest);
    if (value instanceof SharedArrayBuffer)
      views.set(this, [id++, 0, withResolvers()]);
  }
};

const ignoreList = new WeakSet;

/**
 * @template {T}
 * @callback PassThrough
 * @param {T} value
 * @returns {T}
 */

/** @type {PassThrough} */
const ignoreDirect = value => value;

/** @type {PassThrough} */
const ignorePatch = value => {
  ignoreList.add(value);
  return value;
};

const isChannel = (event, channel) => {
  const { data } = event;
  const yes = isArray$1(data) && (
    data.at(0) === channel ||
    (data.at(1) === ACTION_INIT && !channel)
  );
  if (yes) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
  return yes;
};

const isObject = value => (
  value !== null &&
  typeof value === 'object' &&
  !ignoreList.has(value)
);

const transferred = new WeakMap;
const transferViews = (data, transfer, visited) => {
  if (views.has(data))
    transfer.set(data, views.get(data)[0]);
  else if (!(data instanceof TypedArray || data instanceof ArrayBuffer)) {
    for (const value of values(data)) {
      if (isObject(value) && !visited.has(value)) {
        visited.add(value);
        transferViews(value, transfer, visited);
      }
    }
  }
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/waitAsync#browser_compatibility
const waitAsyncPatch = (...args) => ({
  value: new Promise$1(resolve => {
    // encodeURIComponent('onmessage=e=>postMessage(!Atomics.wait(...e.data))')
    let w = new Worker('data:application/javascript,onmessage%3De%3D%3EpostMessage(!Atomics.wait(...e.data))');
    w.onmessage = () => resolve('ok');
    w.postMessage(args);
  })
});

const waitAsyncPoly = (view, index) => {
  const value = views.get(view), [id, _, { promise }] = value;
  value[1] = index;
  return [id, promise];
};

const actionNotify = (_view, _id, _index) => {
  for (const [view, [id, index, { resolve }]] of views) {
    if (_id === id && _index === index) {
      for (let i = 0; i < _view.length; i++) view[i] = _view[i];
      views.delete(view);
      resolve('ok');
      break;
    }
  }
};

const actionWait = (event, transfer, data) => {
  for (const [view, id] of transfer)
    transferred.set(view, [id, event.currentTarget]);
  dispatch(event, data);
};

const postData = (CHANNEL, data) => {
  const transfer = new Map;
  if (isObject(data)) transferViews(data, transfer, new Set);
  return transfer.size ? [CHANNEL, ACTION_WAIT, transfer, data] : data;
};

const getData = view => transferred.get(view);

// (c) Andrea Giammarchi - MIT


let {
  BigInt64Array: BigInt64Array$1,
  Int32Array: Int32Array$3,
  SharedArrayBuffer: SharedArrayBuffer$2,
  Worker: Worker$2,
} = globalThis;

let ignore$2 = ignoreDirect;

const asModule = options => ({ ...options, type: 'module' });

try {
  new SharedArrayBuffer$2(4);

  Worker$2 = class extends Worker$2 {
    constructor(url, options) {
      super(url, asModule(options));
    }
  };

  if (!Atomics$1.waitAsync)
    Atomics$1.waitAsync = waitAsyncPatch;
}
catch (_) {
  const CHANNEL = crypto.randomUUID();

  const serviceWorkers = new Map;
  const sync = new Map;

  const addListener = (self, type, handler, ...rest) => {
    self.addEventListener(type, handler, ...rest);
  };

  const register = ({ serviceWorker: s }, sw, done) => {
    let w;
    addListener(s, 'message', event => {
      if (isChannel(event, CHANNEL)) {
        const [_, id, index] = event.data;
        const uid = [id, index].join(',');
        const done = view => {
          sync.delete(uid);
          w.postMessage([ CHANNEL, id, index, view ]);
        };
        const view = sync.get(uid);
        if (view) done(view);
        else {
          const { promise, resolve } = withResolvers();
          sync.set(uid, resolve);
          promise.then(done);
        }
      }
    });
    s.register(sw).then(function ready(r) {
      w = (r.installing || r.waiting || r.active);
      if (w.state === 'activated')
        done();
      else
        addListener(w, 'statechange', () => ready(r), { once: true });
    });
  };

  ignore$2 = ignorePatch;

  Atomics$1.notify = (view, index) => {
    const [id, worker] = getData(view);
    const uid = [id, index].join(',');
    const known = sync.get(uid);
    if (known) known(view);
    else sync.set(uid, view);
    worker.postMessage([CHANNEL, ACTION_NOTIFY, view, id, index]);
    return 0;
  };

  Atomics$1.waitAsync = (view, ...rest) => {
    const [_, value] = waitAsyncPoly(view, ...rest);
    return { value };
  };

  SharedArrayBuffer$2 = class extends ArrayBuffer {};
  BigInt64Array$1 = extend(BigInt64Array$1, SharedArrayBuffer$2);
  Int32Array$3 = extend(Int32Array$3, SharedArrayBuffer$2);

  Worker$2 = class extends Worker$2 {
    constructor(url, options) {
      let sw = options?.serviceWorker || '';
      if (sw) {
        sw = new URL(sw, location.href).href;
        options = { ...options, serviceWorker: sw };
        if (!serviceWorkers.has(sw)) {
          const { promise, resolve } = withResolvers();
          register(navigator, sw, resolve);
          serviceWorkers.set(sw, promise);
        }
        serviceWorkers.get(sw).then(
          () => super.postMessage([CHANNEL, ACTION_SW])
        );
      }
      super(url, asModule(options));
      super.postMessage([CHANNEL, ACTION_INIT, options]);
      addListener(this, 'message', event => {
        if (isChannel(event, CHANNEL)) {
          const [_, ACTION, ...rest] = event.data;
          switch (ACTION) {
            case ACTION_NOTIFY: {
              actionNotify(...rest);
              break;
            }
            case ACTION_WAIT: {
              actionWait(event, ...rest);
              break;
            }
          }
        }
      });
    }
    postMessage(data, ...rest) {
      return super.postMessage(postData(CHANNEL, data), ...rest);
    }
  };
}

var main = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Atomics: Atomics$1,
  get BigInt64Array () { return BigInt64Array$1; },
  get Int32Array () { return Int32Array$3; },
  get SharedArrayBuffer () { return SharedArrayBuffer$2; },
  get Worker () { return Worker$2; },
  get ignore () { return ignore$2; }
});

// (c) Andrea Giammarchi - MIT


let {
  BigInt64Array,
  Int32Array: Int32Array$2,
  SharedArrayBuffer: SharedArrayBuffer$1,
  addEventListener: addEventListener$1,
  postMessage: postMessage$1,
} = globalThis;

let ignore$1 = ignoreDirect;
let bootstrapping = true;

const ready = withResolvers();

try {
  new SharedArrayBuffer$1(4);

  if (!Atomics$1.waitAsync)
    Atomics$1.waitAsync = waitAsyncPatch;

  ready.resolve();
}
catch (_) {
  const { stringify } = JSON;
  const $postMessage = postMessage$1;
  const $addEventListener = addEventListener$1;

  const messages = [];

  let CHANNEL = '';
  let SERVICE_WORKER = '';

  SharedArrayBuffer$1 = class extends ArrayBuffer {};
  BigInt64Array = extend(BigInt64Array, SharedArrayBuffer$1);
  Int32Array$2 = extend(Int32Array$2, SharedArrayBuffer$1);

  ignore$1 = ignorePatch;

  Atomics$1.notify = (view, index) => {
    const [id] = getData(view);
    $postMessage([CHANNEL, ACTION_NOTIFY, view, id, index]);
    return 0;
  };

  Atomics$1.waitAsync = (...args) => {
    const [_, value] = waitAsyncPoly(...args);
    return { value };
  };

  Atomics$1.wait = (view, index, ...rest) => {
    if (!SERVICE_WORKER)
      throw new SyntaxError('Atomics.wait requires a Service Worker');
    const [id] = waitAsyncPoly(view, index, ...rest);
    const xhr = new XMLHttpRequest;
    xhr.responseType = 'json';
    xhr.open('POST', `${SERVICE_WORKER}?sabayon`, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(stringify([CHANNEL, id, index]));
    const { response } = xhr;
    views.delete(view);
    for (let i = 0; i < response.length; i++) view[i] = response[i];
    return 'ok';
  };

  $addEventListener('message', event => {
    if (isChannel(event, CHANNEL)) {
      const [_, ACTION, ...rest] = event.data;
      switch (ACTION) {
        case ACTION_INIT: {
          CHANNEL = _;
          SERVICE_WORKER = rest.at(0)?.serviceWorker || '';
          if (!SERVICE_WORKER) ready.resolve();
          break;
        }
        case ACTION_NOTIFY: {
          actionNotify(...rest);
          break;
        }
        case ACTION_WAIT: {
          actionWait(event, ...rest);
          break;
        }
        case ACTION_SW: {
          ready.resolve();
          break;
        }
      }
    }
    else if (bootstrapping) {
      const { currentTarget, type, origin, lastEventId, source, ports } = event;
      messages.push([{ currentTarget, type, origin, lastEventId, source, ports }, event.data]);
    }
  });

  addEventListener$1 = (type, ...args) => {
    $addEventListener(type, ...args);
    if (messages.length) {
      for (const args of messages.splice(0))
        dispatch(...args);
    }
  };

  postMessage$1 = (data, ...rest) => $postMessage(postData(CHANNEL, data), ...rest);
}

await ready.promise;

bootstrapping = false;

var worker = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Atomics: Atomics$1,
  get BigInt64Array () { return BigInt64Array; },
  get Int32Array () { return Int32Array$2; },
  get SharedArrayBuffer () { return SharedArrayBuffer$1; },
  get addEventListener () { return addEventListener$1; },
  get ignore () { return ignore$1; },
  get postMessage () { return postMessage$1; }
});

// The goal of this file is to normalize SAB
// at least in main -> worker() use cases.
// This still cannot possibly solve the sync
// worker -> main() use case if SharedArrayBuffer
// is not available or usable.

const {isArray} = Array;

const {
  Atomics,
  Int32Array: Int32Array$1,
  SharedArrayBuffer,
  Worker: Worker$1,
  addEventListener,
  postMessage,
  ignore,
} = globalThis.window ? main : worker;

const {
  notify,
  wait,
  waitAsync,
} = Atomics;

/*! (c) Andrea Giammarchi - ISC */


// just minifier friendly for Blob Workers' cases
const {Map: Map$1, Uint16Array} = globalThis;

// common constants / utilities for repeated operations
const {BYTES_PER_ELEMENT: I32_BYTES} = Int32Array$1;
const {BYTES_PER_ELEMENT: UI16_BYTES} = Uint16Array;

const waitInterrupt = (sb, delay, handler) => {
  while (wait(sb, 0, 0, delay) === 'timed-out')
    handler();
};

// retain buffers to transfer
const buffers = new WeakSet;

// retain either main threads or workers global context
const context = new WeakMap;

const syncResult = {value: {then: fn => fn()}};

// used to generate a unique `id` per each worker `postMessage` "transaction"
let uid = 0;

/**
 * @typedef {Object} Interrupt used to sanity-check interrupts while waiting synchronously.
 * @prop {function} [handler] a callback invoked every `delay` milliseconds.
 * @prop {number} [delay=42] define `handler` invokes in terms of milliseconds.
 */

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 * @param {{parse: (serialized: string) => any, stringify: (serializable: any) => string, transform?: (value:any) => any, interrupt?: () => void | Interrupt}} [JSON] an optional `JSON` like interface to `parse` or `stringify` content with extra `transform` ability.
 * @returns {ProxyHandler<globalThis> | ProxyHandler<Worker>}
 */
const coincident = (self, {parse = JSON.parse, stringify = JSON.stringify, transform, interrupt} = JSON) => {
  // create a Proxy once for the given context (globalThis or Worker instance)
  if (!context.has(self)) {
    const sendMessage = postMessage || self.postMessage;

    // ensure the CHANNEL and data are posted correctly
    const post = (transfer, ...args) => sendMessage.call(self, {[CHANNEL]: args}, {transfer});

    const handler = typeof interrupt === FUNCTION ? interrupt : interrupt?.handler;
    const delay = interrupt?.delay || 42;
    const decoder = new TextDecoder('utf-16');

    // automatically uses sync wait (worker -> main)
    // or fallback to async wait (main -> worker)
    const waitFor = (isAsync, sb) => isAsync ?
      waitAsync(sb, 0) :
      ((handler ? waitInterrupt(sb, delay, handler) : wait(sb, 0)), syncResult);

    // prevent Harakiri https://github.com/WebReflection/coincident/issues/18
    let seppuku = false;

    context.set(self, new Proxy(new Map$1, {
      // there is very little point in checking prop in proxy for this very specific case
      // and I don't want to orchestrate a whole roundtrip neither, as stuff would fail
      // regardless if from Worker we access non existent Main callback, and vice-versa.
      // This is here mostly to guarantee that if such check is performed, at least the
      // get trap goes through and then it's up to developers guarantee they are accessing
      // stuff that actually exists elsewhere.
      [HAS]: (_, action) => typeof action === 'string' && !action.startsWith('_'),

      // worker related: get any utility that should be available on the main thread
      [GET]: (_, action) => action === 'then' ? null : ((...args) => {
        // transaction id
        const id = uid++;

        // first contact: just ask for how big the buffer should be
        // the value would be stored at index [1] while [0] is just control
        let sb = new Int32Array$1(new SharedArrayBuffer(I32_BYTES * 2));

        // if a transfer list has been passed, drop it from args
        let transfer = [];
        if (buffers.has(args.at(-1) || transfer))
          buffers.delete(transfer = args.pop());

        // ask for invoke with arguments and wait for it
        post(transfer, id, sb, action, ignore(transform ? args.map(transform) : args));

        // helps deciding how to wait for results
        const isAsync = self !== globalThis;

        // warn users about possible deadlock still allowing them
        // to explicitly `proxy.invoke().then(...)` without blocking
        let deadlock = 0;
        if (seppuku && isAsync)
          deadlock = setTimeout(console.warn, 1000, `💀🔒 - Possible deadlock if proxy.${action}(...args) is awaited`);

        return waitFor(isAsync, sb).value.then(() => {
          clearTimeout(deadlock);

          // commit transaction using the returned / needed buffer length
          const length = sb[1];

          // filter undefined results
          if (!length) return;

          // calculate the needed ui16 bytes length to store the result string
          const bytes = UI16_BYTES * length;

          // round up to the next amount of bytes divided by 4 to allow i32 operations
          sb = new Int32Array$1(new SharedArrayBuffer(bytes + (bytes % I32_BYTES)));

          // ask for results and wait for it
          post([], id, sb);
          return waitFor(isAsync, sb).value.then(() => parse(
            decoder.decode(new Uint16Array(sb.buffer).slice(0, length)))
          );
        });
      }),

      // main thread related: react to any utility a worker is asking for
      [SET](actions, action, callback) {
        const type = typeof callback;
        if (type !== FUNCTION)
          throw new Error(`Unable to assign ${action} as ${type}`);
        // lazy event listener and logic handling, triggered once by setters actions
        if (!actions.size) {
          // maps results by `id` as they are asked for
          const results = new Map$1;
          // add the event listener once (first defined setter, all others work the same)
          self.addEventListener('message', async (event) => {
            // grub the very same library CHANNEL; ignore otherwise
            const details = event.data?.[CHANNEL];
            if (isArray(details)) {
              // if early enough, avoid leaking data to other listeners
              event.stopImmediatePropagation();
              const [id, sb, ...rest] = details;
              let error;
              // action available: it must be defined/known on the main thread
              if (rest.length) {
                const [action, args] = rest;
                if (actions.has(action)) {
                  seppuku = true;
                  try {
                    // await for result either sync or async and serialize it
                    const result = await actions.get(action)(...args);
                    if (result !== void 0) {
                      const serialized = stringify(transform ? transform(result) : result);
                      // store the result for "the very next" event listener call
                      results.set(id, serialized);
                      // communicate the required SharedArrayBuffer length out of the
                      // resulting serialized string
                      sb[1] = serialized.length;
                    }
                  }
                  catch (_) {
                    error = _;
                  }
                  finally {
                    seppuku = false;
                  }
                }
                // unknown action should be notified as missing on the main thread
                else {
                  error = new Error(`Unsupported action: ${action}`);
                }
                // unlock the wait lock later on
                sb[0] = 1;
              }
              // no action means: get results out of the well known `id`
              // wait lock automatically unlocked here as no `0` value would
              // possibly ever land at index `0`
              else {
                const result = results.get(id);
                results.delete(id);
                // populate the SharedArrayBuffer with utf-16 chars code
                for (let ui16a = new Uint16Array(sb.buffer), i = 0; i < result.length; i++)
                  ui16a[i] = result.charCodeAt(i);
              }
              // release te worker waiting either the length or the result
              notify(sb, 0);
              if (error) throw error;
            }
          });
        }
        // store this action callback allowing the setter in the process
        return !!actions.set(action, callback);
      }
    }));
  }
  return context.get(self);
};

coincident.transfer = (...args) => (buffers.add(args), args);

if (postMessage) globalThis.addEventListener = addEventListener;
else globalThis.Worker = Worker$1;

export { coincident as default };
