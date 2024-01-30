import { target as tv, unwrap, bound, unbound } from 'proxy-target/array';
import { create as createGCHook } from 'gc-hook';

import {
  ARRAY,
  OBJECT,
  FUNCTION,
  NUMBER,
  STRING,
  SYMBOL,
} from 'proxy-target/types';

import {
  TypedArray,
  augment,
  asEntry,
  symbol,
  transform,
} from './utils.js';

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
          return tv(type, ids.get(value));
        }
        if (!(value instanceof TypedArray)) {
          value = $(value);
          for(const key in value)
            value[key] = argument(value[key]);
        }
        return tv(type, value);
      }
    );

    const register = (entry, type, value) => {
      const retained = proxies.get(value)?.deref();
      if (retained) return retained;
      const target = type === FUNCTION ? bound(entry) : entry;
      const proxy = new Proxy(target, proxyHandler);
      proxies.set(value, new WeakRef(proxy));
      return createGCHook(value, onGarbageCollected, {
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

    const global = new Proxy(tv(OBJECT, null), proxyHandler);

    return {
      [name.toLowerCase()]: global,
      [`is${name}Proxy`]: value => typeof value === OBJECT && !!value && __proxy__ in value,
      proxy: main
    };
  };
};
