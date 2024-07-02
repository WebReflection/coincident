// ⚠️ AUTOMATICALLY GENERATED - DO NOT CHANGE
const CHANNEL = '44d49378-13e1-44d3-8c09-7cfcab2ed2ee';

const MAIN = 'M' + CHANNEL;
const THREAD = 'T' + CHANNEL;

const ARRAY     = 'array';
const BIGINT    = 'bigint';
const BOOLEAN   = 'boolean';
const FUNCTION  = 'function';
const NULL      = 'null';
const NUMBER    = 'number';
const OBJECT    = 'object';
const STRING    = 'string';
const SYMBOL    = 'symbol';
const UNDEFINED = 'undefined';

const APPLY                        = 'apply';
const CONSTRUCT                    = 'construct';
const DEFINE_PROPERTY              = 'defineProperty';
const DELETE_PROPERTY              = 'deleteProperty';
const GET                          = 'get';
const GET_OWN_PROPERTY_DESCRIPTOR  = 'getOwnPropertyDescriptor';
const GET_PROTOTYPE_OF             = 'getPrototypeOf';
const HAS                          = 'has';
const IS_EXTENSIBLE                = 'isExtensible';
const OWN_KEYS                     = 'ownKeys';
const PREVENT_EXTENSION            = 'preventExtensions';
const SET                          = 'set';
const SET_PROTOTYPE_OF             = 'setPrototypeOf';

const DELETE = 'delete';

// (c) Andrea Giammarchi - MIT

const ACTION_INIT = 0;
const ACTION_NOTIFY = 1;
const ACTION_WAIT = 2;
const ACTION_SW = 3;

const { ArrayBuffer, Atomics: $Atomics, Promise: Promise$1 } = globalThis;
const { isArray: isArray$2 } = Array;
const { create: create$2, getPrototypeOf: getPrototypeOf$1, values } = Object;

const TypedArray$1 = getPrototypeOf$1(Int32Array);
const Atomics$1 = create$2($Atomics);

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
  const yes = isArray$2(data) && (
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
  else if (!(data instanceof TypedArray$1 || data instanceof ArrayBuffer)) {
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

var main$2 = /*#__PURE__*/Object.freeze({
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

const {isArray: isArray$1} = Array;

const {
  Atomics,
  Int32Array: Int32Array$1,
  SharedArrayBuffer,
  Worker: Worker$1,
  addEventListener,
  postMessage,
  ignore,
} = globalThis.window ? main$2 : worker;

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
const coincident$2 = (self, {parse = JSON.parse, stringify = JSON.stringify, transform, interrupt} = JSON) => {
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
            if (isArray$1(details)) {
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

coincident$2.transfer = (...args) => (buffers.add(args), args);

if (postMessage) globalThis.addEventListener = addEventListener;
else globalThis.Worker = Worker$1;

const { isArray } = Array;

const invoke = value => /** @type {Function} */ (value)();

/**
 * @template Value
 * @param {string} type
 * @param {Value} value
 * @returns {Value}
 */
const reviver = (type, value) => value;

/**
 * @template V
 * @typedef {[V]} Arr
 */

/**
 * @template V
 * @typedef {() => V} Ctx
 */

/**
 * @template T, V
 * @typedef {{t:T, v:V}} Obj
 */

/**
 * @template V
 * @typedef {V extends bigint ? BIGINT : V extends boolean ? BOOLEAN : V extends null ? NULL : V extends number ? NUMBER : V extends string ? STRING : V extends symbol ? SYMBOL : V extends undefined ? UNDEFINED : V extends object ? OBJECT : never} TypeOf
 */

/**
 * @template T, V
 * @param {T} t
 * @param {V} v
 * @returns {Obj<T, V>}
 */
const obj = (t, v) => ({t, v});

/**
 * @template V
 * @param {V} value
 * @returns {Ctx<V>}
 */
const bound = value => Context.bind(value);

/**
 * @template V, T
 * @param {V} value
 * @returns {V extends Ctx<T> ? ReturnType<V> : V}
 */
const unbound = value => (
  typeof value === FUNCTION ? invoke(value) : value
);

// This is needed to unlock *both* apply and construct
// traps otherwise one of these might fail.
// The 'use strict' directive is needed to allow
// also primitive types to be bound.
function Context() {
  return this;
}

// TODO: is this really needed in here?
// const { hasOwn } = Object;
// const isConstructable = value => hasOwn(value, 'prototype');
// const isFunction = value => typeof value === FUNCTION;

/**
 * @template V
 * @typedef {import("./utils.js").Arr<V>} Arr
 */

/**
 * @template T, V
 * @typedef {import("./utils.js").Obj<T, V>} Obj
 */

/**
 * @template V
 * @typedef {import("./utils.js").TypeOf<V>} TypeOf
 */

/**
 * @template W, T, V
 * @typedef {W extends Function ? W : W extends Arr<V> ? W[0] : W extends Obj<T, V> ? W["v"] : never} ValueOf
 */

/**
 * @template {string} T
 * @template V
 * @param {T} type
 * @param {V} value
 * @returns {T extends typeof ARRAY ? Arr<V> : Obj<T, V>}
 */
const target = (type, value) =>
// @see https://github.com/microsoft/TypeScript/issues/33014
// @ts-ignore
(
  type === ARRAY ?
    (/** @type {Arr<V>} */ ([value])) :
    obj(type, value)
);

/**
 * @template W, T, V
 * @param {W} wrap
 * @param {typeof reviver} [revive]
 * @returns
 */
const unwrap = (wrap, revive = reviver) => {
  /** @type {string} */
  let type = typeof wrap, value = wrap;
  if (type === OBJECT) {
    if (isArray(wrap)) {
      type = ARRAY;
      value = wrap.at(0);
    }
    else
      ({ t: type, v: value } = /** @type {Obj<string, any>} */ (wrap));
  }
  return revive(type, /** @type {ValueOf<W, T, V>} */ (value));
};

const resolver = (type, value) => (
  type === FUNCTION ? value : target(type, value)
);

/**
 * @template V
 * @param {V} value
 * @param {Function} [resolve]
 * @returns {V extends Function ? V : V extends Array ? Arr<V> : Obj<TypeOf<V>, V>}
 */
const wrap = (value, resolve = resolver) => {
  const type = value === null ? NULL : typeof value;
  return resolve(type === OBJECT && isArray(value) ? ARRAY : type, value);
};

// (c) Andrea Giammarchi - ISC

const registry = new FinalizationRegistry(
  ([onGarbageCollected, held, debug]) => {
    if (debug) console.debug(`Held value ${String(held)} not relevant anymore`);
    onGarbageCollected(held);
  }
);

const nullHandler = Object.create(null);

/**
 * @template {unknown} H
 * @typedef {Object} GCHookOptions
 * @prop {boolean} [debug=false] if `true`, logs values once these can get collected.
 * @prop {ProxyHandler<object>} [handler] optional proxy handler to use instead of the default one.
 * @prop {H} [return=H] if specified, overrides the returned proxy with its value.
 * @prop {unknown} [token=H] it's the held value by default, but it can be any other token except the returned value itself.
 */

/**
 * @template {unknown} H
 * @param {H} hold the reference to hold behind the scene and passed along the callback once it triggers.
 * @param {(held:H) => void} onGarbageCollected the callback that will receive the held value once its wrapper or indirect reference is no longer needed.
 * @param {GCHookOptions<H>} [options] an optional configuration object to change some default behavior.
 */
const create$1 = (
  hold,
  onGarbageCollected,
  { debug, handler, return: r, token = hold } = nullHandler
) => {
  // if no reference to return is defined,
  // create a proxy for the held one and register that instead.
  /** @type {H} */
  const target = r || new Proxy(hold, handler || nullHandler);
  const args = [target, [onGarbageCollected, hold, !!debug]];
  if (token !== false) args.push(token);
  // register the target reference in a way that
  // the `onGarbageCollected(held)` callback will eventually notify.
  registry.register(...args);
  return target;
};

const {
  defineProperty,
  deleteProperty,
  getOwnPropertyDescriptor,
  getPrototypeOf,
  isExtensible,
  ownKeys,
  preventExtensions,
  set,
  setPrototypeOf
} = Reflect;

const { assign, create } = Object;

const TypedArray = getPrototypeOf(Int8Array);

const augment = (descriptor, how) => {
  const {get, set, value} = descriptor;
  if (get) descriptor.get = how(get);
  if (set) descriptor.set = how(set);
  if (value) descriptor.value = how(value);
  return descriptor;
};

const asEntry = transform => value => wrap(value, (type, value) => {
  switch (type) {
    case NULL:
      return target(NULL, value);
    case OBJECT:
      if (value === globalThis)
        return target(type, null);
    case ARRAY:
    case FUNCTION:
      return transform(type, value);
    case BOOLEAN:
    case NUMBER:
    case STRING:
    case UNDEFINED:
    case BIGINT:
      return target(type, value);
    case SYMBOL: {
      // handle known symbols
      if (symbols.has(value))
        return target(type, symbols.get(value));
      // handle `Symbol.for('...')` cases
      let key = Symbol.keyFor(value);
      if (key)
        return target(type, `.${key}`);
    }
  }
  throw new TypeError(`Unable to handle this ${type}: ${String(value)}`);
});

const symbols = new Map(
  ownKeys(Symbol)
    .filter(s => typeof Symbol[s] === SYMBOL)
    .map(s => [Symbol[s], s])
);

const symbol = value => {
  if (value.startsWith('.'))
    return Symbol.for(value.slice(1));
  for (const [symbol, name] of symbols) {
    if (name === value)
      return symbol;
  }
};

const transform = o => o;

var main$1 = (name, patch) => {
  const eventsHandler = new WeakMap;

  // patch once main UI tread
  {
    const { addEventListener } = EventTarget.prototype;
    // this should never be on the way as it's extremely light and fast
    // but it's necessary to allow "preventDefault" or other event invokes at distance
    defineProperty(EventTarget.prototype, 'addEventListener', {
      value(type, listener, ...options) {
        if (options.at(0)?.invoke) {
          if (!eventsHandler.has(this))
            eventsHandler.set(this, new Map);
          eventsHandler.get(this).set(type, [].concat(options[0].invoke));
          delete options[0].invoke;
        }
        return addEventListener.call(this, type, listener, ...options);
      }
    });
  }

  const handleEvent = (event => {
    const {currentTarget, target, type} = event;
    for (const method of eventsHandler.get(currentTarget || target)?.get(type) || [])
      event[method]();
  });

  return function (thread, MAIN, THREAD, ...args) {
    let id = 0, $ = this?.transform || transform;
    const ids = new Map;
    const values = new Map;

    const {[THREAD]: __thread__} = thread;

    const global = args.length ? assign(create(globalThis), ...args) : globalThis;

    const result = asEntry((type, value) => {
      if (!ids.has(value)) {
        let sid;
        // a bit apocalyptic scenario but if this main runs forever
        // and the id does a whole int32 roundtrip we might have still
        // some reference dangling around
        while (values.has(sid = id++));
        ids.set(value, sid);
        values.set(sid, type === FUNCTION ? value : $(value));
      }
      return target(type, ids.get(value));
    });

    const onGarbageCollected = value => {
      __thread__(DELETE, target(STRING, value));
    };

    const asValue = (type, value) => {
      switch (type) {
        case OBJECT:
          if (value == null) return global;
        case ARRAY:
          if (typeof value === NUMBER) return values.get(value);
          if (!(value instanceof TypedArray)) {
            for (const key in value)
              value[key] = target$1(value[key]);
          }
          return value;
        case FUNCTION:
          if (typeof value === STRING) {
            const retained = values.get(value)?.deref();
            if (retained) return retained;
            const cb = function (...args) {
              if (args.at(0) instanceof Event) handleEvent(...args);
              return __thread__(
                APPLY,
                target(FUNCTION, value),
                result(this),
                args.map(result)
              );
            };
            values.set(value, new WeakRef(cb));
            return create$1(value, onGarbageCollected, {
              return: cb,
              token: false,
            });
          }
          return values.get(value);
        case SYMBOL:
          return symbol(value);
      }
      return value;
    };

    const target$1 = entry => unwrap(entry, asValue);

    const trapsHandler = {
      [APPLY]: (target, thisArg, args) => result(target.apply(thisArg, args)),
      [CONSTRUCT]: (target, args) => result(new target(...args)),
      [DEFINE_PROPERTY]: (target, name, descriptor) => result(defineProperty(target, name, descriptor)),
      [DELETE_PROPERTY]: (target, name) => result(deleteProperty(target, name)),
      [GET_PROTOTYPE_OF]: target => result(getPrototypeOf(target)),
      [GET]: (target, name) => result(target[name]),
      [GET_OWN_PROPERTY_DESCRIPTOR]: (target$1, name) => {
        const descriptor = getOwnPropertyDescriptor(target$1, name);
        return descriptor ? target(OBJECT, augment(descriptor, result)) : target(UNDEFINED, descriptor);
      },
      [HAS]: (target, name) => result(name in target),
      [IS_EXTENSIBLE]: target => result(isExtensible(target)),
      [OWN_KEYS]: target$1 => target(ARRAY, ownKeys(target$1).map(result)),
      [PREVENT_EXTENSION]: target => result(preventExtensions(target)),
      [SET]: (target, name, value) => result(set(target, name, value)),
      [SET_PROTOTYPE_OF]: (target, proto) => result(setPrototypeOf(target, proto)),
      [DELETE](id) {
        ids.delete(values.get(id));
        values.delete(id);
      }
    };

    thread[MAIN] = (trap, entry, ...args) => {
      switch (trap) {
        case APPLY:
          args[0] = target$1(args[0]);
          args[1] = args[1].map(target$1);
          break;
        case CONSTRUCT:
          args[0] = args[0].map(target$1);
          break;
        case DEFINE_PROPERTY: {
          const [name, descriptor] = args;
          args[0] = target$1(name);
          const {get, set, value} = descriptor;
          if (get) descriptor.get = target$1(get);
          if (set) descriptor.set = target$1(set);
          if (value) descriptor.value = target$1(value);
          break;
        }
        default:
          args = args.map(target$1);
          break;
      }
      return trapsHandler[trap](target$1(entry), ...args);
    };

    return {
      proxy: thread,
      [name.toLowerCase()]: global,
      [`is${name}Proxy`]: () => false
    };
  };
};

var main = main$1('Window');

var thread$1 = name => {
  let id = 0;
  const ids = new Map;
  const values = new Map;

  const __proxy__ = Symbol();

  return function (main, MAIN, THREAD) {
    const $ = this?.transform || transform;
    const { [MAIN]: __main__ } = main;

    const proxies = new Map;

    const onGarbageCollected = value => {
      proxies.delete(value);
      __main__(DELETE, argument(value));
    };

    const argument = asEntry(
      (type, value) => {
        if (__proxy__ in value)
          return unbound(value[__proxy__]);
        if (type === FUNCTION) {
          value = $(value);
          if (!values.has(value)) {
            let sid;
            // a bit apocalyptic scenario but if this thread runs forever
            // and the id does a whole int32 roundtrip we might have still
            // some reference dangling around
            while (values.has(sid = String(id++)));
            ids.set(value, sid);
            values.set(sid, value);
          }
          return target(type, ids.get(value));
        }
        if (!(value instanceof TypedArray)) {
          value = $(value);
          for(const key in value)
            value[key] = argument(value[key]);
        }
        return target(type, value);
      }
    );

    const register = (entry, type, value) => {
      const retained = proxies.get(value)?.deref();
      if (retained) return retained;
      const target = type === FUNCTION ? bound(entry) : entry;
      const proxy = new Proxy(target, proxyHandler);
      proxies.set(value, new WeakRef(proxy));
      return create$1(value, onGarbageCollected, {
        return: proxy,
        token: false,
      });
    };

    const fromEntry = entry => unwrap(entry, (type, value) => {
      switch (type) {
        case OBJECT:
          if (value === null) return globalThis;
        case ARRAY:
          return typeof value === NUMBER ? register(entry, type, value) : value;
        case FUNCTION:
          return typeof value === STRING ? values.get(value) : register(entry, type, value);
        case SYMBOL:
          return symbol(value);
      }
      return value;
    });

    const result = (TRAP, target, ...args) => fromEntry(__main__(TRAP, unbound(target), ...args));

    const proxyHandler = {
      [APPLY]: (target, thisArg, args) => result(APPLY, target, argument(thisArg), args.map(argument)),
      [CONSTRUCT]: (target, args) => result(CONSTRUCT, target, args.map(argument)),
      [DEFINE_PROPERTY]: (target, name, descriptor) => {
        const { get, set, value } = descriptor;
        if (typeof get === FUNCTION) descriptor.get = argument(get);
        if (typeof set === FUNCTION) descriptor.set = argument(set);
        if (typeof value === FUNCTION) descriptor.value = argument(value);
        return result(DEFINE_PROPERTY, target, argument(name), descriptor);
      },
      [DELETE_PROPERTY]: (target, name) => result(DELETE_PROPERTY, target, argument(name)),
      [GET_PROTOTYPE_OF]: target => result(GET_PROTOTYPE_OF, target),
      [GET]: (target, name) => name === __proxy__ ? target : result(GET, target, argument(name)),
      [GET_OWN_PROPERTY_DESCRIPTOR]: (target, name) => {
        const descriptor = result(GET_OWN_PROPERTY_DESCRIPTOR, target, argument(name));
        return descriptor && augment(descriptor, fromEntry);
      },
      [HAS]: (target, name) => name === __proxy__ || result(HAS, target, argument(name)),
      [IS_EXTENSIBLE]: target => result(IS_EXTENSIBLE, target),
      [OWN_KEYS]: target => result(OWN_KEYS, target).map(fromEntry),
      [PREVENT_EXTENSION]: target => result(PREVENT_EXTENSION, target),
      [SET]: (target, name, value) => result(SET, target, argument(name), argument(value)),
      [SET_PROTOTYPE_OF]: (target, proto) => result(SET_PROTOTYPE_OF, target, argument(proto)),
    };

    main[THREAD] = (trap, entry, ctx, args) => {
      switch (trap) {
        case APPLY:
          return fromEntry(entry).apply(fromEntry(ctx), args.map(fromEntry));
        case DELETE: {
          const id = fromEntry(entry);
          ids.delete(values.get(id));
          values.delete(id);
        }
      }
    };

    const global = new Proxy(target(OBJECT, null), proxyHandler);

    return {
      [name.toLowerCase()]: global,
      [`is${name}Proxy`]: value => typeof value === OBJECT && !!value && __proxy__ in value,
      proxy: main
    };
  };
};

var thread = thread$1('Window');

const proxies = new WeakMap;

/**
 * @typedef {object} Coincident
 * @property {ProxyHandler<globalThis>} proxy
 * @property {ProxyHandler<Window>} window
 * @property {(value: any) => boolean} isWindowProxy
 */

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * In workers, returns a `{proxy, window, isWindowProxy}` namespace to reach main globals synchronously.
 * @param {Worker | globalThis} self the context in which code should run
 * @returns {ProxyHandler<Worker> | Coincident}
 */
const coincident$1 = (self, ...args) => {
  const proxy = coincident$2(self, ...args);
  if (!proxies.has(proxy)) {
    const util = Worker$1 && self instanceof Worker$1 ? main : thread;
    proxies.set(proxy, util.call(args.at(0), proxy, MAIN, THREAD));
  }
  return proxies.get(proxy);
};

coincident$1.transfer = coincident$2.transfer;

// ⚠️ WARNING - THIS FILE IS AN ARTIFACT - DO NOT EDIT

/**
 * @param {Document} document
 * @returns {import("./keyed.js")}
 */
var init = document => (function () {

  const { constructor: DocumentFragment } = document.createDocumentFragment();

  /**
   * ISC License
   *
   * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */

  /**
   * @param {Node} parentNode The container where children live
   * @param {Node[]} a The list of current/live children
   * @param {Node[]} b The list of future children
   * @param {(entry: Node, action: number) => Node} get
   * The callback invoked per each entry related DOM operation.
   * @param {Node} [before] The optional node used as anchor to insert before.
   * @returns {Node[]} The same list of future children.
   */
  var udomdiff = /* c8 ignore start */(parentNode, a, b, get, before) => {
    const bLength = b.length;
    let aEnd = a.length;
    let bEnd = bLength;
    let aStart = 0;
    let bStart = 0;
    let map = null;
    while (aStart < aEnd || bStart < bEnd) {
      // append head, tail, or nodes in between: fast path
      if (aEnd === aStart) {
        // we could be in a situation where the rest of nodes that
        // need to be added are not at the end, and in such case
        // the node to `insertBefore`, if the index is more than 0
        // must be retrieved, otherwise it's gonna be the first item.
        const node = bEnd < bLength ?
          (bStart ?
            (get(b[bStart - 1], -0).nextSibling) :
            get(b[bEnd - bStart], 0)) :
          before;
        while (bStart < bEnd)
          parentNode.insertBefore(get(b[bStart++], 1), node);
      }
      // remove head or tail: fast path
      else if (bEnd === bStart) {
        while (aStart < aEnd) {
          // remove the node only if it's unknown or not live
          if (!map || !map.has(a[aStart]))
            parentNode.removeChild(get(a[aStart], -1));
          aStart++;
        }
      }
      // same node: fast path
      else if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
      }
      // same tail: fast path
      else if (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      // The once here single last swap "fast path" has been removed in v1.1.0
      // https://github.com/WebReflection/udomdiff/blob/single-final-swap/esm/index.js#L69-L85
      // reverse swap: also fast path
      else if (
        a[aStart] === b[bEnd - 1] &&
        b[bStart] === a[aEnd - 1]
      ) {
        // this is a "shrink" operation that could happen in these cases:
        // [1, 2, 3, 4, 5]
        // [1, 4, 3, 2, 5]
        // or asymmetric too
        // [1, 2, 3, 4, 5]
        // [1, 2, 3, 5, 6, 4]
        const node = get(a[--aEnd], -1).nextSibling;
        parentNode.insertBefore(
          get(b[bStart++], 1),
          get(a[aStart++], -1).nextSibling
        );
        parentNode.insertBefore(get(b[--bEnd], 1), node);
        // mark the future index as identical (yeah, it's dirty, but cheap 👍)
        // The main reason to do this, is that when a[aEnd] will be reached,
        // the loop will likely be on the fast path, as identical to b[bEnd].
        // In the best case scenario, the next loop will skip the tail,
        // but in the worst one, this node will be considered as already
        // processed, bailing out pretty quickly from the map index check
        a[aEnd] = b[bEnd];
      }
      // map based fallback, "slow" path
      else {
        // the map requires an O(bEnd - bStart) operation once
        // to store all future nodes indexes for later purposes.
        // In the worst case scenario, this is a full O(N) cost,
        // and such scenario happens at least when all nodes are different,
        // but also if both first and last items of the lists are different
        if (!map) {
          map = new Map;
          let i = bStart;
          while (i < bEnd)
            map.set(b[i], i++);
        }
        // if it's a future node, hence it needs some handling
        if (map.has(a[aStart])) {
          // grab the index of such node, 'cause it might have been processed
          const index = map.get(a[aStart]);
          // if it's not already processed, look on demand for the next LCS
          if (bStart < index && index < bEnd) {
            let i = aStart;
            // counts the amount of nodes that are the same in the future
            let sequence = 1;
            while (++i < aEnd && i < bEnd && map.get(a[i]) === (index + sequence))
              sequence++;
            // effort decision here: if the sequence is longer than replaces
            // needed to reach such sequence, which would brings again this loop
            // to the fast path, prepend the difference before a sequence,
            // and move only the future list index forward, so that aStart
            // and bStart will be aligned again, hence on the fast path.
            // An example considering aStart and bStart are both 0:
            // a: [1, 2, 3, 4]
            // b: [7, 1, 2, 3, 6]
            // this would place 7 before 1 and, from that time on, 1, 2, and 3
            // will be processed at zero cost
            if (sequence > (index - bStart)) {
              const node = get(a[aStart], 0);
              while (bStart < index)
                parentNode.insertBefore(get(b[bStart++], 1), node);
            }
            // if the effort wasn't good enough, fallback to a replace,
            // moving both source and target indexes forward, hoping that some
            // similar node will be found later on, to go back to the fast path
            else {
              parentNode.replaceChild(
                get(b[bStart++], 1),
                get(a[aStart++], -1)
              );
            }
          }
          // otherwise move the source forward, 'cause there's nothing to do
          else
            aStart++;
        }
        // this node has no meaning in the future list, so it's more than safe
        // to remove it, and check the next live node out instead, meaning
        // that only the live list index should be forwarded
        else
          parentNode.removeChild(get(a[aStart++], -1));
      }
    }
    /* c8 ignore stop */return b;
  };

  const { isArray } = Array;
  const { getPrototypeOf, getOwnPropertyDescriptor } = Object;

  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  const empty = [];

  const newRange = () => document.createRange();

  /**
   * Set the `key` `value` pair to the *Map* or *WeakMap* and returns the `value`
   * @template T
   * @param {Map | WeakMap} map
   * @param {any} key
   * @param {T} value
   * @returns {T}
   */
  const set = (map, key, value) => {
    map.set(key, value);
    return value;
  };

  /**
   * Return a descriptor, if any, for the referenced *Element*
   * @param {Element} ref
   * @param {string} prop
   * @returns 
   */
  const gPD = (ref, prop) => {
    let desc;
    do { desc = getOwnPropertyDescriptor(ref, prop); }
    while(!desc && (ref = getPrototypeOf(ref)));
    return desc;
  };

  /* c8 ignore start */
  /**
   * @param {DocumentFragment} content
   * @param {number[]} path
   * @returns {Element}
   */
  const find = (content, path) => path.reduceRight(childNodesIndex, content);
  const childNodesIndex = (node, i) => node.childNodes[i];
  /* c8 ignore stop */

  const ELEMENT_NODE = 1;
  const COMMENT_NODE = 8;
  const DOCUMENT_FRAGMENT_NODE = 11;

  /*! (c) Andrea Giammarchi - ISC */
  const {setPrototypeOf} = Object;

  /**
   * @param {Function} Class any base class to extend without passing through it via super() call.
   * @returns {Function} an extensible class for the passed one.
   * @example
   *  // creating this very same module utility
   *  import custom from 'custom-function/factory';
   *  const CustomFunction = custom(Function);
   *  class MyFunction extends CustomFunction {}
   *  const mf = new MyFunction(() => {});
   */
  var custom = Class => {
    function Custom(target) {
      return setPrototypeOf(target, new.target.prototype);
    }
    Custom.prototype = Class.prototype;
    return Custom;
  };

  let range$1;
  /**
   * @param {Node | Element} firstChild
   * @param {Node | Element} lastChild
   * @param {boolean} preserve
   * @returns
   */
  var drop = (firstChild, lastChild, preserve) => {
    if (!range$1) range$1 = newRange();
    /* c8 ignore start */
    if (preserve)
      range$1.setStartAfter(firstChild);
    else
      range$1.setStartBefore(firstChild);
    /* c8 ignore stop */
    range$1.setEndAfter(lastChild);
    range$1.deleteContents();
    return firstChild;
  };

  /**
   * @param {PersistentFragment} fragment
   * @returns {Node | Element}
   */
  const remove = ({firstChild, lastChild}, preserve) => drop(firstChild, lastChild, preserve);

  let checkType = false;

  /**
   * @param {Node} node
   * @param {1 | 0 | -0 | -1} operation
   * @returns {Node}
   */
  const diffFragment = /* c8 ignore start */(node, operation) => (
    checkType && node.nodeType === DOCUMENT_FRAGMENT_NODE ?
      ((1 / operation) < 0 ?
        (operation ? remove(node, true) : node.lastChild) :
        (operation ? node.valueOf() : node.firstChild)) :
      node
  );

  const comment = value => document.createComment(value);

  /** @extends {DocumentFragment} */
  class PersistentFragment extends custom(DocumentFragment) {
    #firstChild = comment('<>');
    #lastChild = comment('</>');
    #nodes = empty;
    constructor(fragment) {
      super(fragment);
      this.replaceChildren(...[
        this.#firstChild,
        ...fragment.childNodes,
        this.#lastChild,
      ]);
      checkType = true;
    }
    get firstChild() { /* c8 ignore stop */return this.#firstChild; }
    get lastChild() { return this.#lastChild; }
    get parentNode() { return this.#firstChild.parentNode; }
    remove() {
      remove(this, false);
    }
    /* c8 ignore start */
    replaceWith(node) {
      remove(this, true).replaceWith(node);
    }
    /* c8 ignore stop */
    valueOf() {
      const { parentNode } = this;
      if (parentNode === this) {
        if (this.#nodes === empty)
          this.#nodes = [...this.childNodes];
      }
      else {
        /* c8 ignore start */
        // there are cases where a fragment might be just appended
        // out of the box without valueOf() invoke (first render).
        // When these are moved around and lose their parent and,
        // such parent is not the fragment itself, it's possible there
        // where changes or mutations in there to take care about.
        // This is a render-only specific issue but it's tested and
        // it's worth fixing to me to have more consistent fragments.
        if (parentNode) {
          let { firstChild, lastChild } = this;
          this.#nodes = [firstChild];
          while (firstChild !== lastChild)
            this.#nodes.push((firstChild = firstChild.nextSibling));
        }
        /* c8 ignore stop */
        this.replaceChildren(...this.#nodes);
      }
      return this;
    }
  }

  const setAttribute = (element, name, value) =>
    element.setAttribute(name, value);

  /**
   * @param {Element} element
   * @param {string} name
   * @returns {void}
   */
  const removeAttribute = (element, name) =>
    element.removeAttribute(name);

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const aria = (element, value) => {
    for (const key in value) {
      const $ = value[key];
      const name = key === 'role' ? key : `aria-${key}`;
      if ($ == null) removeAttribute(element, name);
      else setAttribute(element, name, $);
    }
    return value;
  };

  let listeners;

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const at = (element, value, name) => {
    name = name.slice(1);
    if (!listeners) listeners = new WeakMap;
    const known = listeners.get(element) || set(listeners, element, {});
    let current = known[name];
    if (current && current[0]) element.removeEventListener(name, ...current);
    current = isArray(value) ? value : [value, false];
    known[name] = current;
    if (current[0]) element.addEventListener(name, ...current);
    return value;
  };

  /**
   * @template T
   * @param {import("./literals.js").Detail} detail
   * @param {T} value
   * @returns {T}
   */
  const hole = (detail, value) => {
    const { t: node, n: hole } = detail;
    let nullish = false;
    switch (typeof value) {
      case 'object':
        if (value !== null) {
          (hole || node).replaceWith((detail.n = value.valueOf()));
          break;
        }
      case 'undefined':
        nullish = true;
      default:
        node.data = nullish ? '' : value;
        if (hole) {
          detail.n = null;
          hole.replaceWith(node);
        }
        break;
    }
    return value;
  };

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const className = (element, value) => maybeDirect(
    element, value, value == null ? 'class' : 'className'
  );

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const data = (element, value) => {
    const { dataset } = element;
    for (const key in value) {
      if (value[key] == null) delete dataset[key];
      else dataset[key] = value[key];
    }
    return value;
  };

  /**
   * @template T
   * @param {Element | CSSStyleDeclaration} ref
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const direct = (ref, value, name) => (ref[name] = value);

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const dot = (element, value, name) => direct(element, value, name.slice(1));

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const maybeDirect = (element, value, name) => (
    value == null ?
      (removeAttribute(element, name), value) :
      direct(element, value, name)
  );

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const ref = (element, value) => (
    (typeof value === 'function' ?
      value(element) : (value.current = element)),
    value
  );

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const regular = (element, value, name) => (
    (value == null ?
      removeAttribute(element, name) :
      setAttribute(element, name, value)),
    value
  );

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const style = (element, value) => (
    value == null ?
      maybeDirect(element, value, 'style') :
      direct(element.style, value, 'cssText')
  );

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const toggle = (element, value, name) => (
    element.toggleAttribute(name.slice(1), value),
    value
  );

  /**
   * @param {Node} node
   * @param {Node[]} value
   * @param {string} _
   * @param {Node[]} prev
   * @returns {Node[]}
   */
  const array = (node, value, prev) => {
    // normal diff
    const { length } = value;
    node.data = `[${length}]`;
    if (length)
      return udomdiff(node.parentNode, prev, value, diffFragment, node);
    /* c8 ignore start */
    switch (prev.length) {
      case 1:
        prev[0].remove();
      case 0:
        break;
      default:
        drop(
          diffFragment(prev[0], 0),
          diffFragment(prev.at(-1), -0),
          false
        );
        break;
    }
    /* c8 ignore stop */
    return empty;
  };

  const attr = new Map([
    ['aria', aria],
    ['class', className],
    ['data', data],
    ['ref', ref],
    ['style', style],
  ]);

  /**
   * @param {HTMLElement | SVGElement} element
   * @param {string} name
   * @param {boolean} svg
   * @returns
   */
  const attribute = (element, name, svg) => {
    switch (name[0]) {
      case '.': return dot;
      case '?': return toggle;
      case '@': return at;
      default: return (
        /* c8 ignore start */ svg || ('ownerSVGElement' in element) /* c8 ignore stop */ ?
          (name === 'ref' ? ref : regular) :
          (attr.get(name) || (
            name in element ?
              (name.startsWith('on') ?
                direct :
                (gPD(element, name)?.set ? maybeDirect : regular)
              ) :
              regular
            )
          )
      );
    }
  };

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const text = (element, value) => (
    (element.textContent = value == null ? '' : value),
    value
  );

  /** @typedef {import("./persistent-fragment.js").PersistentFragment} PersistentFragment */
  /** @typedef {import("./rabbit.js").Hole} Hole */

  /** @typedef {unknown} Value */
  /** @typedef {Node | Element | PersistentFragment} Target */
  /** @typedef {null | undefined | string | number | boolean | Node | Element | PersistentFragment} DOMValue */
  /** @typedef {Hole | Node} ArrayValue */

  const abc = (a, b, c) => ({ a, b, c });

  const bc = (b, c) => ({ b, c });

  /**
   * @typedef {Object} Detail
   * @property {any} v the current value of the interpolation / hole
   * @property {function} u the callback to update the value
   * @property {Node} t the target comment node or element
   * @property {string | null | Node} n the attribute name, if any, or `null`
   * @property {Cache | ArrayValue[] | null} c the cache value for this detail
   */

  /**
   * @returns {Detail}
   */
  const detail = (u, t, n, c) => ({ v: empty, u, t, n, c });

  /**
   * @typedef {Object} Entry
   * @property {number[]} a the path to retrieve the node
   * @property {function} b the update function
   * @property {string | null} c the attribute name, if any, or `null`
   */

  /**
   * @typedef {Object} Cache
   * @property {null | TemplateStringsArray} a the cached template
   * @property {null | Node | PersistentFragment} b the node returned when parsing the template
   * @property {Detail[]} c the list of updates to perform
   */

  /**
   * @returns {Cache}
   */
  const cache$1 = () => abc(null, null, empty);

  /** @param {(template: TemplateStringsArray, values: any[]) => import("./parser.js").Resolved} parse */
  var create = parse => (
    /**
     * @param {TemplateStringsArray} template
     * @param {any[]} values
     * @returns {import("./literals.js").Cache}
     */
    (template, values) => {
      const { a: fragment, b: entries, c: direct } = parse(template, values);
      const root = document.importNode(fragment, true);
      /** @type {import("./literals.js").Detail[]} */
      let details = empty;
      if (entries !== empty) {
        details = [];
        for (let current, prev, i = 0; i < entries.length; i++) {
          const { a: path, b: update, c: name } = entries[i];
          const node = path === prev ? current : (current = find(root, (prev = path)));
          details[i] = detail(
            update,
            node,
            name,
            update === array ? [] : (update === hole ? cache$1() : null)
          );
        }
      }
      return bc(
        direct ? root.firstChild : new PersistentFragment(root),
        details,
      );
    }
  );

  const TEXT_ELEMENTS = /^(?:plaintext|script|style|textarea|title|xmp)$/i;
  const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

  /*! (c) Andrea Giammarchi - ISC */

  const elements = /<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g;
  const attributes = /([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g;
  const holes = /[\x01\x02]/g;

  // \x01 Node.ELEMENT_NODE
  // \x02 Node.ATTRIBUTE_NODE

  /**
   * Given a template, find holes as both nodes and attributes and
   * return a string with holes as either comment nodes or named attributes.
   * @param {string[]} template a template literal tag array
   * @param {string} prefix prefix to use per each comment/attribute
   * @param {boolean} xml enforces self-closing tags
   * @returns {string} X/HTML with prefixed comments or attributes
   */
  var parser$1 = (template, prefix, xml) => {
    let i = 0;
    return template
      .join('\x01')
      .trim()
      .replace(
        elements,
        (_, name, attrs, selfClosing) => `<${
          name
        }${
          attrs.replace(attributes, '\x02=$2$1').trimEnd()
        }${
          selfClosing ? (
            (xml || VOID_ELEMENTS.test(name)) ? ' /' : `></${name}`
          ) : ''
        }>`
      )
      .replace(
        holes,
        hole => hole === '\x01' ? `<!--${prefix + i++}-->` : (prefix + i++)
      )
    ;
  };

  let template = document.createElement('template'), svg$1, range;

  /**
   * @param {string} text
   * @param {boolean} xml
   * @returns {DocumentFragment}
   */
  var createContent = (text, xml) => {
    if (xml) {
      if (!svg$1) {
        svg$1 = document.createElementNS(SVG_NAMESPACE, 'svg');
        range = newRange();
        range.selectNodeContents(svg$1);
      }
      return range.createContextualFragment(text);
    }
    template.innerHTML = text;
    const { content } = template;
    template = template.cloneNode(false);
    return content;
  };

  /** @typedef {import("./literals.js").Entry} Entry */

  /**
   * @typedef {Object} Resolved
   * @param {DocumentFragment} f content retrieved from the template
   * @param {Entry[]} e entries per each hole in the template
   * @param {boolean} d direct node to handle
   */

  /**
   * @param {Element} node
   * @returns {number[]}
   */
  const createPath = node => {
    const path = [];
    let parentNode;
    while ((parentNode = node.parentNode)) {
      path.push(path.indexOf.call(parentNode.childNodes, node));
      node = parentNode;
    }
    return path;
  };

  const textNode = () => document.createTextNode('');

  /**
   * @param {TemplateStringsArray} template
   * @param {boolean} xml
   * @returns {Resolved}
   */
  const resolve = (template, values, xml) => {
    const content = createContent(parser$1(template, prefix, xml), xml);
    const { length } = template;
    let entries = empty;
    if (length > 1) {
      const replace = [];
      const tw = document.createTreeWalker(content, 1 | 128);
      let i = 0, search = `${prefix}${i++}`;
      entries = [];
      while (i < length) {
        const node = tw.nextNode();
        // these are holes or arrays
        if (node.nodeType === COMMENT_NODE) {
          if (node.data === search) {
            // ⚠️ once array, always array!
            const update = isArray(values[i - 1]) ? array : hole;
            if (update === hole) replace.push(node);
            entries.push(abc(createPath(node), update, null));
            search = `${prefix}${i++}`;
          }
        }
        else {
          let path;
          // these are attributes
          while (node.hasAttribute(search)) {
            if (!path) path = createPath(node);
            const name = node.getAttribute(search);
            entries.push(abc(path, attribute(node, name, xml), name));
            removeAttribute(node, search);
            search = `${prefix}${i++}`;
          }
          // these are special text-only nodes
          if (
            !xml &&
            TEXT_ELEMENTS.test(node.localName) &&
            node.textContent.trim() === `<!--${search}-->`
          ) {
            entries.push(abc(path || createPath(node), text, null));
            search = `${prefix}${i++}`;
          }
        }
      }
      // can't replace holes on the fly or the tree walker fails
      for (i = 0; i < replace.length; i++)
        replace[i].replaceWith(textNode());
    }

    // need to decide if there should be a persistent fragment
    const { childNodes } = content;
    let { length: len } = childNodes;

    // html`` or svg`` to signal an empty content
    // these nodes can be passed directly as never mutated
    if (len < 1) {
      len = 1;
      content.appendChild(textNode());
    }
    // html`${'b'}` or svg`${[]}` cases
    else if (
      len === 1 &&
      // ignore html`static` or svg`static` because
      // these nodes can be passed directly as never mutated
      length !== 1 &&
      childNodes[0].nodeType !== ELEMENT_NODE
    ) {
      // use a persistent fragment for these cases too
      len = 0;
    }

    return set(cache, template, abc(content, entries, len === 1));
  };

  /** @type {WeakMap<TemplateStringsArray, Resolved>} */
  const cache = new WeakMap;
  const prefix = 'isµ';

  /**
   * @param {boolean} xml
   * @returns {(template: TemplateStringsArray, values: any[]) => Resolved}
   */
  var parser = xml => (template, values) => cache.get(template) || resolve(template, values, xml);

  const createHTML = create(parser(false));
  const createSVG = create(parser(true));

  /**
   * @param {import("./literals.js").Cache} info
   * @param {Hole} hole
   * @returns {Node}
   */
  const unroll = (info, { s, t, v }) => {
    if (info.a !== t) {
      const { b, c } = (s ? createSVG : createHTML)(t, v);
      info.a = t;
      info.b = b;
      info.c = c;
    }
    for (let { c } = info, i = 0; i < c.length; i++) {
      const value = v[i];
      const detail = c[i];
      switch (detail.u) {
        case array:
          detail.v = array(
            detail.t,
            unrollValues(detail.c, value),
            detail.v
          );
          break;
        case hole:
          const current = value instanceof Hole ?
            unroll(detail.c || (detail.c = cache$1()), value) :
            (detail.c = null, value)
          ;
          if (current !== detail.v)
            detail.v = hole(detail, current);
          break;
        default:
          if (value !== detail.v)
            detail.v = detail.u(detail.t, value, detail.n, detail.v);
          break;
      }
    }
    return info.b;
  };

  /**
   * @param {Cache} cache
   * @param {any[]} values
   * @returns {number}
   */
  const unrollValues = (stack, values) => {
    let i = 0, { length } = values;
    if (length < stack.length) stack.splice(length);
    for (; i < length; i++) {
      const value = values[i];
      if (value instanceof Hole)
        values[i] = unroll(stack[i] || (stack[i] = cache$1()), value);
      else stack[i] = null;
    }
    return values;
  };

  /**
   * Holds all details needed to render the content on a render.
   * @constructor
   * @param {boolean} svg The content type.
   * @param {TemplateStringsArray} template The template literals used to the define the content.
   * @param {any[]} values Zero, one, or more interpolated values to render.
   */
  class Hole {
    constructor(svg, template, values) {
      this.s = svg;
      this.t = template;
      this.v = values;
    }
    toDOM(info = cache$1()) {
      return unroll(info, this);
    }
  }

  /*! (c) Andrea Giammarchi - MIT */

  /** @typedef {import("./literals.js").Value} Value */

  const tag = svg => (template, ...values) => new Hole(svg, template, values);

  /** @type {(template: TemplateStringsArray, ...values:Value[]) => Hole} A tag to render HTML content. */
  const html = tag(false);

  /** @type {(template: TemplateStringsArray, ...values:Value[]) => Hole} A tag to render SVG content. */
  const svg = tag(true);

  /** @type {WeakMap<Element | DocumentFragment, import("../literals.js").Cache>} */
  const known = new WeakMap;

  /**
    * Render with smart updates within a generic container.
    * @template T
    * @param {T} where the DOM node where to render content
    * @param {(() => Hole) | Hole} what the hole to render
    * @param {boolean} check does a `typeof` check (internal usage).
    * @returns
    */
  var render = (where, what, check) => {
    const info = known.get(where) || set(known, where, cache$1());
    const { b } = info;
    const hole = (typeof what === 'function') ? what() : what;
    const node = hole instanceof Hole ? hole.toDOM(info) : hole;
    if (b !== node)
      where.replaceChildren((info.b = node).valueOf());
    return where;
  };

  /** @typedef {import("../rabbit.js").Hole} Hole */

  /**
    * Render with smart updates within a generic container.
    * @template T
    * @param {T} where the DOM node where to render content
    * @param {(() => Hole) | Hole} what the hole to render
    * @returns
    */
  var keyed$1 = (where, what) => render(where, what);

  /*! (c) Andrea Giammarchi - MIT */

  /** @typedef {import("./literals.js").Cache} Cache */
  /** @typedef {import("./literals.js").Target} Target */
  /** @typedef {import("./literals.js").Value} Value */

  /** @typedef {(ref:Object, key:string | number) => Tag} Bound */

  /**
   * @callback Tag
   * @param {TemplateStringsArray} template
   * @param  {...Value} values
   * @returns {Target}
   */

  const keyed = new WeakMap;
  const createRef = svg => /** @type {Bound} */ (ref, key) => {
    /** @type {Tag} */
    function tag(template, ...values) {
      return new Hole(svg, template, values).toDOM(this);
    }

    const memo = keyed.get(ref) || set(keyed, ref, new Map);
    return memo.get(key) || set(memo, key, tag.bind(cache$1()));
  };

  /** @type {Bound} Returns a bound tag to render HTML content. */
  const htmlFor = createRef(false);

  /** @type {Bound} Returns a bound tag to render SVG content. */
  const svgFor = createRef(true);

  return { Hole, attr, html, htmlFor, render: keyed$1, svg, svgFor };

})();

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * In workers, returns a `{proxy, window, isWindowProxy}` namespace to reach main globals synchronously.
 * @param {Worker | globalThis} self the context in which code should run
 */
const coincident = (self, ...args) => {
  const utilities = coincident$1(self, ...args);
  if (!utilities.uhtml)
    utilities.uhtml = init(utilities.window.document);
  return utilities;
};

coincident.transfer = coincident$1.transfer;

export { coincident as default };
