Promise.withResolvers || (Promise.withResolvers = function withResolvers() {
  var a, b, c = new this(function (resolve, reject) {
    a = resolve;
    b = reject;
  });
  return {resolve: a, reject: b, promise: c};
});

// ⚠️ AUTOMATICALLY GENERATED - DO NOT CHANGE
const CHANNEL = '8569d938-ee44-4a9c-88e5-268e851ce66f';

const MAIN = 'M' + CHANNEL;
const THREAD = 'T' + CHANNEL;

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
const SET$1                          = 'set';
const SET_PROTOTYPE_OF             = 'setPrototypeOf';
const DELETE                       = 'delete';

const OBJECT$1    = 'object';
const FUNCTION  = 'function';
const BOOLEAN   = 'boolean';
const NUMBER    = 'number';
const STRING    = 'string';
const UNDEFINED = 'undefined';
const BIGINT$1    = 'bigint';
const SYMBOL    = 'symbol';
const NULL      = 'null';

const {
  defineProperty,
  getOwnPropertyDescriptor,
  getPrototypeOf,
  isExtensible,
  ownKeys,
  preventExtensions,
  set,
  setPrototypeOf
} = Reflect;

const {assign, create} = Object;

const TypedArray = getPrototypeOf(Int8Array);

const isArray$1 = 'isArray';

const augment = (descriptor, how) => {
  const {get, set, value} = descriptor;
  if (get) descriptor.get = how(get);
  if (set) descriptor.set = how(set);
  if (value) descriptor.value = how(value);
  return descriptor;
};

const entry = (type, value) => [type, value];

const asEntry = transform => value => {
  const type = typeof value;
  switch (type) {
    case OBJECT$1:
    if (value == null)
      return entry(NULL, value);
    case FUNCTION:
      return transform(type, value);
    case BOOLEAN:
    case NUMBER:
    case STRING:
    case UNDEFINED:
    case BIGINT$1:
      return entry(type, value);
    case SYMBOL: {
      if (symbols.has(value))
        return entry(type, symbols.get(value));
    }
  }
  throw new Error(`Unable to handle this ${type} type`);
};

const symbols = new Map(
  ownKeys(Symbol)
    .filter(s => typeof Symbol[s] === SYMBOL)
    .map(s => [Symbol[s], s])
);
  
const symbol = value => {
  for (const [symbol, name] of symbols) {
    if (name === value)
      return symbol;
  }
};

function Bound() {
  return this;
}

const VOID       = -1;
const PRIMITIVE  = 0;
const ARRAY      = 1;
const OBJECT     = 2;
const DATE       = 3;
const REGEXP     = 4;
const MAP        = 5;
const SET        = 6;
const ERROR      = 7;
const BIGINT     = 8;
// export const SYMBOL = 9;

const env = typeof self === 'object' ? self : globalThis;

const deserializer = ($, _) => {
  const as = (out, index) => {
    $.set(index, out);
    return out;
  };

  const unpair = index => {
    if ($.has(index))
      return $.get(index);

    const [type, value] = _[index];
    switch (type) {
      case PRIMITIVE:
      case VOID:
        return as(value, index);
      case ARRAY: {
        const arr = as([], index);
        for (const index of value)
          arr.push(unpair(index));
        return arr;
      }
      case OBJECT: {
        const object = as({}, index);
        for (const [key, index] of value)
          object[unpair(key)] = unpair(index);
        return object;
      }
      case DATE:
        return as(new Date(value), index);
      case REGEXP: {
        const {source, flags} = value;
        return as(new RegExp(source, flags), index);
      }
      case MAP: {
        const map = as(new Map, index);
        for (const [key, index] of value)
          map.set(unpair(key), unpair(index));
        return map;
      }
      case SET: {
        const set = as(new Set, index);
        for (const index of value)
          set.add(unpair(index));
        return set;
      }
      case ERROR: {
        const {name, message} = value;
        return as(new env[name](message), index);
      }
      case BIGINT:
        return as(BigInt(value), index);
      case 'BigInt':
        return as(Object(BigInt(value)), index);
    }
    return as(new env[type](value), index);
  };

  return unpair;
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns a deserialized value from a serialized array of Records.
 * @param {Record[]} serialized a previously serialized value.
 * @returns {any}
 */
const deserialize = serialized => deserializer(new Map, serialized)(0);

const EMPTY = '';

const {toString} = {};
const {keys} = Object;

const typeOf = value => {
  const type = typeof value;
  if (type !== 'object' || !value)
    return [PRIMITIVE, type];

  const asString = toString.call(value).slice(8, -1);
  switch (asString) {
    case 'Array':
      return [ARRAY, EMPTY];
    case 'Object':
      return [OBJECT, EMPTY];
    case 'Date':
      return [DATE, EMPTY];
    case 'RegExp':
      return [REGEXP, EMPTY];
    case 'Map':
      return [MAP, EMPTY];
    case 'Set':
      return [SET, EMPTY];
  }

  if (asString.includes('Array'))
    return [ARRAY, asString];

  if (asString.includes('Error'))
    return [ERROR, asString];

  return [OBJECT, asString];
};

const shouldSkip = ([TYPE, type]) => (
  TYPE === PRIMITIVE &&
  (type === 'function' || type === 'symbol')
);

const serializer = (strict, json, $, _) => {

  const as = (out, value) => {
    const index = _.push(out) - 1;
    $.set(value, index);
    return index;
  };

  const pair = value => {
    if ($.has(value))
      return $.get(value);

    let [TYPE, type] = typeOf(value);
    switch (TYPE) {
      case PRIMITIVE: {
        let entry = value;
        switch (type) {
          case 'bigint':
            TYPE = BIGINT;
            entry = value.toString();
            break;
          case 'function':
          case 'symbol':
            if (strict)
              throw new TypeError('unable to serialize ' + type);
            entry = null;
            break;
          case 'undefined':
            return as([VOID], value);
        }
        return as([TYPE, entry], value);
      }
      case ARRAY: {
        if (type)
          return as([type, [...value]], value);
  
        const arr = [];
        const index = as([TYPE, arr], value);
        for (const entry of value)
          arr.push(pair(entry));
        return index;
      }
      case OBJECT: {
        if (type) {
          switch (type) {
            case 'BigInt':
              return as([type, value.toString()], value);
            case 'Boolean':
            case 'Number':
            case 'String':
              return as([type, value.valueOf()], value);
          }
        }

        if (json && ('toJSON' in value))
          return pair(value.toJSON());

        const entries = [];
        const index = as([TYPE, entries], value);
        for (const key of keys(value)) {
          if (strict || !shouldSkip(typeOf(value[key])))
            entries.push([pair(key), pair(value[key])]);
        }
        return index;
      }
      case DATE:
        return as([TYPE, value.toISOString()], value);
      case REGEXP: {
        const {source, flags} = value;
        return as([TYPE, {source, flags}], value);
      }
      case MAP: {
        const entries = [];
        const index = as([TYPE, entries], value);
        for (const [key, entry] of value) {
          if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry))))
            entries.push([pair(key), pair(entry)]);
        }
        return index;
      }
      case SET: {
        const entries = [];
        const index = as([TYPE, entries], value);
        for (const entry of value) {
          if (strict || !shouldSkip(typeOf(entry)))
            entries.push(pair(entry));
        }
        return index;
      }
    }

    const {message} = value;
    return as([TYPE, {name: type, message}], value);
  };

  return pair;
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns an array of serialized Records.
 * @param {any} value a serializable value.
 * @param {{json?: boolean, lossy?: boolean}?} options an object with a `lossy` or `json` property that,
 *  if `true`, will not throw errors on incompatible types, and behave more
 *  like JSON stringify would behave. Symbol and Function will be discarded.
 * @returns {Record[]}
 */
 const serialize = (value, {json, lossy} = {}) => {
  const _ = [];
  return serializer(!(json || lossy), !!json, new Map, _)(value), _;
};

/*! (c) Andrea Giammarchi - ISC */


const {parse: $parse, stringify: $stringify} = JSON;
const options = {json: true, lossy: true};

/**
 * Revive a previously stringified structured clone.
 * @param {string} str previously stringified data as string.
 * @returns {any} whatever was previously stringified as clone.
 */
const parse$1 = str => deserialize($parse(str));

/**
 * Represent a structured clone value as string.
 * @param {any} any some clone-able value to stringify.
 * @returns {string} the value stringified.
 */
const stringify$1 = any => $stringify(serialize(any, options));

var JSON$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  parse: parse$1,
  stringify: stringify$1
});

// encodeURIComponent('onmessage=({data:b})=>(Atomics.wait(b,0),postMessage(0))')

var waitAsyncFallback = buffer => ({
  value: new Promise(onmessage => {
    let w = new Worker('data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))');
    w.onmessage = onmessage;
    w.postMessage(buffer);
  })
});

/*! (c) Andrea Giammarchi - ISC */


// just minifier friendly for Blob Workers' cases
const {Int32Array, Map: Map$1, SharedArrayBuffer, Uint16Array} = globalThis;

// common constants / utilities for repeated operations
const {BYTES_PER_ELEMENT: I32_BYTES} = Int32Array;
const {BYTES_PER_ELEMENT: UI16_BYTES} = Uint16Array;

const {isArray} = Array;
const {notify, wait, waitAsync} = Atomics;
const {fromCharCode} = String;

// automatically uses sync wait (worker -> main)
// or fallback to async wait (main -> worker)
const waitFor = (isAsync, sb) => isAsync ?
                  (waitAsync || waitAsyncFallback)(sb, 0) :
                  (wait(sb, 0), {value: {then: fn => fn()}});

// retain buffers to transfer
const buffers = new WeakSet;

// retain either main threads or workers global context
const context = new WeakMap;

// used to generate a unique `id` per each worker `postMessage` "transaction"
let uid = 0;

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 * @param {{parse: (serialized: string) => any, stringify: (serializable: any) => string}} [JSON] an optional `JSON` like interface to `parse` or `stringify` content
 * @returns {ProxyHandler<globalThis> | ProxyHandler<Worker>}
 */
const coincident$2 = (self, {parse, stringify} = JSON) => {
  // create a Proxy once for the given context (globalThis or Worker instance)
  if (!context.has(self)) {
    // ensure the CHANNEL and data are posted correctly
    const post = (transfer, ...args) => self.postMessage({[CHANNEL]: args}, {transfer});

    context.set(self, new Proxy(new Map$1, {
      // there is very little point in checking prop in proxy for this very specific case
      // and I don't want to orchestrate a whole roundtrip neither, as stuff would fail
      // regardless if from Worker we access non existent Main callback, and vice-versa.
      // This is here mostly to guarantee that if such check is performed, at least the
      // get trap goes through and then it's up to developers guarantee they are accessing
      // stuff that actually exists elsewhere.
      has: (_, action) => typeof action === 'string' && !action.startsWith('_'),

      // worker related: get any utility that should be available on the main thread
      get: (_, action) => action === 'then' ? null : ((...args) => {
        // transaction id
        const id = uid++;

        // first contact: just ask for how big the buffer should be
        let sb = new Int32Array(new SharedArrayBuffer(I32_BYTES));

        // if a transfer list has been passed, drop it from args
        let transfer = [];
        if (buffers.has(args.at(-1) || transfer))
          buffers.delete(transfer = args.pop());

        // ask for invoke with arguments and wait for it
        post(transfer, id, sb, action, args);

        // helps deciding how to wait for results
        const isAsync = self instanceof Worker;
        return waitFor(isAsync, sb).value.then(() => {
          // commit transaction using the returned / needed buffer length
          const length = sb[0];

          // filter undefined results
          if (!length) return;

          // calculate the needed ui16 bytes length to store the result string
          const bytes = UI16_BYTES * length;

          // round up to the next amount of bytes divided by 4 to allow i32 operations
          sb = new Int32Array(new SharedArrayBuffer(bytes + (bytes % I32_BYTES)));

          // ask for results and wait for it
          post([], id, sb);
          return waitFor(isAsync, sb).value.then(
            // transform the shared buffer into a string and return it parsed
            () => parse(fromCharCode(...new Uint16Array(sb.buffer).slice(0, length)))
          );
        });
      }),

      // main thread related: react to any utility a worker is asking for
      set(actions, action, callback) {
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
              // action available: it must be defined/known on the main thread
              if (rest.length) {
                const [action, args] = rest;
                if (actions.has(action)) {
                  // await for result either sync or async and serialize it
                  const result = stringify(await actions.get(action)(...args));
                  if (result) {
                    // store the result for "the very next" event listener call
                    results.set(id, result);
                    // communicate the required SharedArrayBuffer length out of the
                    // resulting serialized string
                    sb[0] = result.length;
                  }
                }
                // unknown action should be notified as missing on the main thread
                else {
                  throw new Error(`Unsupported action: ${action}`);
                }
              }
              // no action means: get results out of the well known `id`
              else {
                const result = results.get(id);
                results.delete(id);
                // populate the SaredArrayBuffer with utf-16 chars code
                for (let ui16a = new Uint16Array(sb.buffer), i = 0; i < result.length; i++)
                  ui16a[i] = result.charCodeAt(i);
              }
              // release te worker waiting either the length or the result
              notify(sb, 0);
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

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 * @returns {ProxyHandler<globalThis> | ProxyHandler<Worker>}
 */
const coincident$1 = self => coincident$2(self, JSON$1);

coincident$1.transfer = coincident$2.transfer;

var main$1 = (name, patch) => {
  let id = 0;
  const ids = new Map;
  const values = new Map;
  const eventsHandler = patch && new WeakMap;

  // patch once main UI tread
  if (patch) {
    const {addEventListener} = EventTarget.prototype;
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
  
  const handleEvent = patch && (event => {
    const {currentTarget, target, type} = event;
    for (const method of eventsHandler.get(currentTarget || target)?.get(type) || [])
      event[method]();
  });
  
  const result = asEntry((type, value) => {
    if (!ids.has(value)) {
      let sid;
      // a bit apocalyptic scenario but if this main runs forever
      // and the id does a whole int32 roundtrip we might have still
      // some reference danglign around
      while (values.has(sid = id++));
      ids.set(value, sid);
      values.set(sid, value);
    }
    return entry(type, ids.get(value));
  });
  
  return (thread, MAIN, THREAD, ...args) => {
    const {[THREAD]: __thread__} = thread;

    const global = args.length ? assign(create(globalThis), ...args) : globalThis;
  
    const registry = new FinalizationRegistry(id => {
      __thread__(DELETE, entry(STRING, id));
    });
  
    const target = ([type, value]) => {
      switch (type) {
        case OBJECT$1:
          if (value == null)
            return global;
          if (typeof value === NUMBER)
            return values.get(value);
          if (!(value instanceof TypedArray)) {
            for (const key in value)
              value[key] = target(value[key]);
          }
          return value;
        case FUNCTION:
          if (typeof value === STRING) {
            if (!values.has(value)) {
              const cb = function (...args) {
                if (patch && args.at(0) instanceof Event) handleEvent(...args);
                return __thread__(
                  APPLY,
                  entry(FUNCTION, value),
                  result(this),
                  args.map(result)
                );
              };
              const ref = new WeakRef(cb);
              values.set(value, ref);
              registry.register(cb, value, ref);
            }
            return values.get(value).deref();
          }
          return values.get(value);
        case SYMBOL:
          return symbol(value);
      }
      return value;
    };
  
    const trapsHandler = {
      [APPLY]: (target, thisArg, args) => result(target.apply(thisArg, args)),
      [CONSTRUCT]: (target, args) => result(new target(...args)),
      [DEFINE_PROPERTY]: (target, name, descriptor) => result(defineProperty(target, name, descriptor)),
      [DELETE_PROPERTY]: (target, name) => result(delete target[name]),
      [GET_PROTOTYPE_OF]: target => result(getPrototypeOf(target)),
      [GET]: (target, name) => result(target[name]),
      [GET_OWN_PROPERTY_DESCRIPTOR]: (target, name) => {
        const descriptor = getOwnPropertyDescriptor(target, name);
        return descriptor ? entry(OBJECT$1, augment(descriptor, result)) : entry(UNDEFINED, descriptor);
      },
      [HAS]: (target, name) => result(name in target),
      [IS_EXTENSIBLE]: target => result(isExtensible(target)),
      [OWN_KEYS]: target => entry(OBJECT$1, ownKeys(target).map(result)),
      [PREVENT_EXTENSION]: target => result(preventExtensions(target)),
      [SET$1]: (target, name, value) => result(set(target, name, value)),
      [SET_PROTOTYPE_OF]: (target, proto) => result(setPrototypeOf(target, proto)),
      [DELETE](id) {
        ids.delete(values.get(id));
        values.delete(id);
      }
    };
  
    thread[MAIN] = (trap, entry, ...args) => {
      switch (trap) {
        case APPLY:
          args[0] = target(args[0]);
          args[1] = args[1].map(target);
          break;
        case CONSTRUCT:
          args[0] = args[0].map(target);
          break;
        case DEFINE_PROPERTY: {
          const [name, descriptor] = args;
          args[0] = target(name);
          const {get, set, value} = descriptor;
          if (get) descriptor.get = target(get);
          if (set) descriptor.set = target(set);
          if (value) descriptor.value = target(value);
          break;
        }
        default:
          args = args.map(target);
          break;
      }
  
      return trapsHandler[trap](target(entry), ...args);
    };
  
    return {
      proxy: thread,
      [name.toLowerCase()]: global,
      [`is${name}Proxy`]: () => false
    };
  };
};

var main = main$1('Window', true);

var thread$1 = name => {
  let id = 0;
  const ids = new Map;
  const values = new Map;
  
  const __proxied__ = Symbol();
  
  const bound = target => typeof target === FUNCTION ? target() : target;
  
  const isProxy = value => typeof value === OBJECT$1 && !!value && __proxied__ in value;
  
  const localArray = Array[isArray$1];
  
  const argument = asEntry(
    (type, value) => {
      if (__proxied__ in value)
        return bound(value[__proxied__]);
      if (type === FUNCTION) {
        if (!values.has(value)) {
          let sid;
          // a bit apocalyptic scenario but if this thread runs forever
          // and the id does a whole int32 roundtrip we might have still
          // some reference dangling around
          while (values.has(sid = String(id++)));
          ids.set(value, sid);
          values.set(sid, value);
        }
        return entry(type, ids.get(value));
      }
      if (!(value instanceof TypedArray)) {
        for(const key in value)
          value[key] = argument(value[key]);
      }
      return entry(type, value);
    }
  );
  
  return (main, MAIN, THREAD) => {
    const { [MAIN]: __main__ } = main;
  
    const proxies = new Map;
  
    const registry = new FinalizationRegistry(id => {
      proxies.delete(id);
      __main__(DELETE, argument(id));
    });
  
    const register = (entry) => {
      const [type, value] = entry;
      if (!proxies.has(value)) {
        const target = type === FUNCTION ? Bound.bind(entry) : entry;
        const proxy = new Proxy(target, proxyHandler);
        const ref = new WeakRef(proxy);
        proxies.set(value, ref);
        registry.register(proxy, value, ref);
      }
      return proxies.get(value).deref();
    };
  
    const fromEntry = entry => {
      const [type, value] = entry;
      switch (type) {
        case OBJECT$1:
          return typeof value === NUMBER ? register(entry) : value;
        case FUNCTION:
          return typeof value === STRING ? values.get(value) : register(entry);
        case SYMBOL:
          return symbol(value);
      }
      return value;
    };
  
    const result = (TRAP, target, ...args) => fromEntry(__main__(TRAP, bound(target), ...args));
  
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
      [GET]: (target, name) => name === __proxied__ ? target : result(GET, target, argument(name)),
      [GET_OWN_PROPERTY_DESCRIPTOR]: (target, name) => {
        const descriptor = result(GET_OWN_PROPERTY_DESCRIPTOR, target, argument(name));
        return descriptor && augment(descriptor, fromEntry);
      },
      [HAS]: (target, name) => name === __proxied__ || result(HAS, target, argument(name)),
      [IS_EXTENSIBLE]: target => result(IS_EXTENSIBLE, target),
      [OWN_KEYS]: target => result(OWN_KEYS, target).map(fromEntry),
      [PREVENT_EXTENSION]: target => result(PREVENT_EXTENSION, target),
      [SET$1]: (target, name, value) => result(SET$1, target, argument(name), argument(value)),
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
  
    const global = new Proxy([OBJECT$1, null], proxyHandler);
  
    // this is needed to avoid confusion when new Proxy([type, value])
    // passes through `isArray` check, as that would return always true
    // by specs and there's no Proxy trap to avoid it.
    const remoteArray = global.Array[isArray$1];
    defineProperty(Array, isArray$1, {
      value: ref => isProxy(ref) ? remoteArray(ref) : localArray(ref)
    });
  
    return {
      [name.toLowerCase()]: global,
      [`is${name}Proxy`]: isProxy,
      proxy: main
    };
  };
};

var thread = thread$1('Window');

var serverMain = main$1('Server', false);

var serverThread = thread$1('Server');

const SERVER_MAIN = 'S' + MAIN;
const SERVER_THREAD = 'S' + THREAD;

const {parse, stringify} = JSON$1;

const isServer = !!globalThis.process;
const proxies = new WeakMap;

/**
 * @typedef {object} Coincident
 * @property {ProxyHandler<globalThis>} proxy
 * @property {ProxyHandler<Window>} window
 * @property {(value: any) => boolean} isWindowProxy
 */

/**
 * @typedef {object & Coincident} CoincidentWorker
 * @property {ProxyHandler<globalThis>} proxy
 * @property {ProxyHandler<Window>} window
 * @property {(value: any) => boolean} isWindowProxy
 * @property {ProxyHandler<NodeJS>} server
 * @property {(value: any) => boolean} isServerProxy
 */

/**
 * @callback CoincidentServer
 * @param {WebSocketServer} wss the WebSocketServer to use to handle Worker/Server calls
 * @param {object} [globals] optional globals to expose through the Worker via the proxy
 * @returns {WebSocketServer}
 */

/**
 * @callback CoincidentWeb
 * @param {globalThis | Worker} self either the main thread (Worker)or a worker (in main thread UI)
 * @param  {WebSocket} [ws] the optional WebSocket to use when `self` is `globalThis` 
 * @returns {Coincident | CoincidentWorker}
 */

const parseData = data => {
  let id;
  if (/^!(-?\d+)?/.test(data)) {
    id = RegExp.$1;
    data = data.slice(1 + id.length);
  }
  return {id, result: data ? parse(data) : void 0};
};

const coincident = isServer ?
  /** @type {CoincidentServer} */
  (wss, globals) => {
    let id = 0, ws = null;
    const resolvers = new Map;
    const util = serverMain(
      {[SERVER_THREAD]: async (trap, ...args) => {
        const data = stringify([trap, ...args]);
        if (trap === APPLY) {
          const {promise, resolve} = Promise.withResolvers();
          const uid = String(id++);
          resolvers.set(uid, resolve);
          ws.send('!' + uid + data);
          return await promise;
        }
        ws.send('!' + data);
      }},
      SERVER_MAIN,
      SERVER_THREAD,
      globals
    );
    const __main__ = util.proxy[SERVER_MAIN];
    return wss.on('connection', $ws => {
      if (ws !== null) return $ws.close();
      ws = $ws
        .on('close', () => {
          ws = null;
          for (const [_, resolve] of resolvers) resolve();
          resolvers.clear();
        })
        .on('message', buffer => {
          const {id, result} = parseData(String(buffer));
          if (id) {
            const resolve = resolvers.get(id);
            resolvers.delete(id);
            resolve(result);
          }
          else
            ws.send(stringify(__main__(...result)));
        });
    });
  } :

  /** @type {CoincidentWeb} */
  (self, ws) => {
    const proxy = coincident$1(self);
    if (!proxies.has(proxy)) {
      const util = self instanceof Worker ? mainBridge : threadBridge;
      proxies.set(proxy, util(proxy, MAIN, THREAD, ws));
    }
    return proxies.get(proxy);
  }
;

if (!isServer)
  coincident.transfer = coincident$1.transfer;

const mainBridge = (thread, MAIN, THREAD, ws) => {
  let resolve;
  const {[SERVER_THREAD]: __thread__} = thread;
  ws.addEventListener('message', async ({data}) => {
    const {id, result} = parseData(data);
    if (id != null) {
      const invoke = __thread__(...result);
      if (id) {
        const out = await invoke;
        ws.send('!' + id + (out === void 0 ? '' : stringify(out)));
      }
    }
    else
      resolve = resolve(result);
  });
  thread[SERVER_MAIN] = (...args) => new Promise($ => {
    resolve = $;
    ws.send(stringify(args));
  });
  return main(thread, MAIN, THREAD);
};

const threadBridge = (proxy, MAIN, THREAD) => assign(
  serverThread(proxy, SERVER_MAIN, SERVER_THREAD),
  thread(proxy, MAIN, THREAD)
);

export { coincident as default };
