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
const coincident$1 = (self, {parse = JSON.parse, stringify = JSON.stringify, transform, interrupt} = JSON) => {
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

coincident$1.transfer = (...args) => (buffers.add(args), args);

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
const coincident = (self, ...args) => {
  const proxy = coincident$1(self, ...args);
  if (!proxies.has(proxy)) {
    const util = Worker$1 && self instanceof Worker$1 ? main : thread;
    proxies.set(proxy, util.call(args.at(0), proxy, MAIN, THREAD));
  }
  return proxies.get(proxy);
};

coincident.transfer = coincident$1.transfer;

export { coincident as default };
