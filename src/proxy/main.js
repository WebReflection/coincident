import {
  APPLY,
  DEFINE_PROPERTY,
  GET,
  GET_OWN_PROPERTY_DESCRIPTOR,
  OWN_KEYS,
  DESTRUCT,
} from 'js-proxy/traps';

import {
  ARRAY,
  FUNCTION,
  NULL,
  NUMBER,
  OBJECT,
  STRING,
  SYMBOL,
  UNDEFINED,
} from 'js-proxy/types';

import DEBUG from '../debug.js';

import { drop, get, hold } from 'js-proxy/heap';
import { TypedArray } from 'sabayon/shared';

import numeric from '../window/types.js';
import { fromSymbol, toSymbol } from '../window/symbol.js';

import { create } from 'gc-hook';

import handleEvent from '../window/events.js';

const { isArray } = Array;

export const toEntry = value => {
  if (DEBUG) console.log('toEntry', typeof value);
  const TYPE = typeof value;
  switch (TYPE) {
    case OBJECT: {
      if (value === null) return [numeric[NULL], value];
      if (value === globalThis) return [numeric[OBJECT], null];
      if (isArray(value)) return [numeric[ARRAY], hold(value)];
      return [numeric[OBJECT], value instanceof TypedArray ? value : hold(value)];
    }
    case FUNCTION: return [numeric[FUNCTION], hold(value)];
    case SYMBOL: return [numeric[SYMBOL], toSymbol(value)];
    default: return [numeric[TYPE], value];
  }
};

export default (resolve, __worker__) => {
  const proxies = new Map;
  const onGC = ref => {
    if (DEBUG) console.info('main collecting', ref);
    proxies.delete(ref);
    __worker__(DESTRUCT, ref);
  }

  const fromEntry = ([numericTYPE, value]) => {
    switch (numericTYPE) {
      case numeric[OBJECT]: {
        if (value === null) return globalThis;
        if (typeof value === NUMBER) return get(value);
        if (!(value instanceof TypedArray)) {
          for (const key in value)
            value[key] = fromEntry(value[key]);
        }
        return value;
      };
      case numeric[ARRAY]: {
        if (typeof value === NUMBER) return get(value);
        return value.map(fromEntry);
      };
      case numeric[FUNCTION]: {
        switch (typeof value) {
          case NUMBER: return get(value);
          case STRING: {
            let fn = proxies.get(value)?.deref();
            if (!fn) {
              fn = create(value, onGC, {
                token: false,
                return: function (...args) {
                  if (args.length && args[0] instanceof Event) handleEvent(args[0]);
                  return __worker__(APPLY, value, toEntry(this), args.map(toEntry)).then(fromEntry);
                }
              });
              proxies.set(value, new WeakRef(fn));
            }
            return fn;
          }
        }
      };
      case numeric[SYMBOL]: return fromSymbol(value);
      default: return value;
    }
  };

  const asEntry = (method, target, args) => toEntry(method(target, ...args.map(fromEntry)));
  const asImport = name => import(resolve(name));

  return (TRAP, ref, ...args) => {
    if (TRAP === DESTRUCT) {
      if (DEBUG) console.info('main dropping', ref);
      drop(ref);
    }
    else {
      const method = Reflect[TRAP];
      const target = ref == null ? globalThis : get(ref);
      switch (TRAP) {
        case DEFINE_PROPERTY: {
          const [name, descriptor] = args.map(fromEntry);
          return toEntry(method(target, name, descriptor));
        }
        case GET_OWN_PROPERTY_DESCRIPTOR: {
          const descriptor = method(target, ...args.map(fromEntry));
          if (descriptor) {
            const { get, set, value } = descriptor;
            if (get) descriptor.get = toEntry(get);
            if (set) descriptor.set = toEntry(set);
            if (value) descriptor.value = toEntry(value);
          }
          return [numeric[descriptor ? OBJECT : UNDEFINED], descriptor];
        }
        case OWN_KEYS: return [numeric[ARRAY], method(target).map(toEntry)];
        case GET: {
          if (ref == null && args[0][1] === 'import')
            return toEntry(asImport);
        }
        default: return asEntry(method, target, args);
      }
    }
  };
};
