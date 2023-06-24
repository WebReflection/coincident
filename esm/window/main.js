import {
  TypedArray,
  defineProperty,
  getOwnPropertyDescriptor,
  getPrototypeOf,
  isExtensible,
  ownKeys,
  preventExtensions,
  set,
  setPrototypeOf,

  augment,
  entry,
  asEntry,
  symbol
} from './utils.js';

import {
  OBJECT,
  FUNCTION,
  NUMBER,
  STRING,
  SYMBOL,
  UNDEFINED
} from './types.js';

import {
  APPLY,
  CONSTRUCT,
  DEFINE_PROPERTY,
  DELETE_PROPERTY,
  GET,
  GET_OWN_PROPERTY_DESCRIPTOR,
  GET_PROTOTYPE_OF,
  HAS,
  IS_EXTENSIBLE,
  OWN_KEYS,
  PREVENT_EXTENSION,
  SET,
  SET_PROTOTYPE_OF,
  DELETE
} from './traps.js';

let id = 0;
const ids = new Map;
const values = new Map;
const eventsHandler = new WeakMap;

// patch once main UI tread
if (globalThis.window === globalThis) {
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

const handleEvent = event => {
  const {currentTarget, target, type} = event;
  for (const method of eventsHandler.get(currentTarget || target)?.get(type) || [])
    event[method]();
};

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

export default (thread, MAIN, THREAD) => {
  const {[THREAD]: __thread__} = thread;

  const registry = new FinalizationRegistry(id => {
    __thread__(DELETE, entry(STRING, id));
  });

  const target = ([type, value]) => {
    switch (type) {
      case OBJECT:
        if (value == null)
          return globalThis;
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
              if (args.at(0) instanceof Event) handleEvent(...args);
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
      return descriptor ? entry(OBJECT, augment(descriptor, result)) : entry(UNDEFINED, descriptor);
    },
    [HAS]: (target, name) => result(name in target),
    [IS_EXTENSIBLE]: target => result(isExtensible(target)),
    [OWN_KEYS]: target => entry(OBJECT, ownKeys(target).map(result)),
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
    window: globalThis,
    isWindowProxy: () => false
  };
};
