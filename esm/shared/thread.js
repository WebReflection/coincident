import { create as createGCHook } from 'gc-hook';

import {
  Bound,
  TypedArray,
  augment,
  defineProperty,
  entry,
  asEntry,
  symbol,
  transform,
  isArray
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

export default name => {
  let id = 0;
  const ids = new Map;
  const values = new Map;

  const __proxied__ = Symbol();

  const bound = target => typeof target === FUNCTION ? target() : target;

  const isProxy = value => typeof value === OBJECT && !!value && __proxied__ in value;

  const localArray = Array[isArray];

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
        if (__proxied__ in value)
          return bound(value[__proxied__]);
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
          return entry(type, ids.get(value));
        }
        if (!(value instanceof TypedArray)) {
          if (type === OBJECT)
            value = $(value);
          for(const key in value)
            value[key] = argument(value[key]);
        }
        return entry(type, value);
      }
    );

    const register = (entry) => {
      const [type, value] = entry;
      if (!proxies.has(value)) {
        const target = type === FUNCTION ? Bound.bind(entry) : entry;
        const proxy = new Proxy(target, proxyHandler);
        proxies.set(value, new WeakRef(proxy));
        return createGCHook(value, onGarbageCollected, {
          return: proxy,
          token: false,
        });
      }
      return proxies.get(value).deref();
    };

    const fromEntry = entry => {
      const [type, value] = entry;
      switch (type) {
        case OBJECT:
          return value === null ? globalThis : (
            typeof value === NUMBER ? register(entry) : value
          );
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

    const global = new Proxy([OBJECT, null], proxyHandler);

    // this is needed to avoid confusion when new Proxy([type, value])
    // passes through `isArray` check, as that would return always true
    // by specs and there's no Proxy trap to avoid it.
    const remoteArray = global.Array[isArray];
    defineProperty(Array, isArray, {
      value: ref => isProxy(ref) ? remoteArray(ref) : localArray(ref)
    });

    return {
      [name.toLowerCase()]: global,
      [`is${name}Proxy`]: isProxy,
      proxy: main
    };
  };
};
