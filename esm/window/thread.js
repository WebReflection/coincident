import {
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
  SYMBOL
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

const bound = target => typeof target === FUNCTION ? target() : target;

const argument = asEntry(
  (type, value) => {
    if (__proxied__ in value)
      return bound(value[__proxied__]);
    if (type === FUNCTION) {
      if (!values.has(value)) {
        let sid;
        // a bit apocalyptic scenario but if this thread runs forever
        // and the id does a whole int32 roundtrip we might have still
        // some reference danglign around
        while (values.has(sid = String(id++)));
        ids.set(value, sid);
        values.set(sid, value);
      }
      return entry(type, ids.get(value));
    }
    return entry(type, value);
  }
);

const __proxied__ = Symbol();

let id = 0;
const ids = new Map;
const values = new Map;

export default (main, MAIN, THREAD) => {
  const {[MAIN]: __main__} = main;

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
      case OBJECT:
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
      const {get, set, value} = descriptor;
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

  return {
    proxy: main,
    window: new Proxy([OBJECT, null], proxyHandler),
    isWindowProxy: value => typeof value === OBJECT && !!value && __proxied__ in value,
    // TODO: remove this stuff ASAP
    get global() {
      console.warn('Deprecated: please access `window` field instead');
      return this.window;
    },
    get isGlobal() {
      return function (value) {
        console.warn('Deprecated: please access `isWindowProxy` field instead');
        return this.isWindowProxy(value);
      }.bind(this);
    }
  };
};

function Bound() {
  return this;
}
