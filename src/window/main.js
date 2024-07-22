import { drop, get, hold } from 'js-proxy/heap';
import { TypedArray } from 'sabayon/shared';

import coincident from '../main.js';
import numeric from './types.js';
import { fromSymbol, toSymbol } from './symbol.js';

import {
  APPLY,
  DEFINE_PROPERTY,
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

import { MAIN, WORKER } from './constants.js';

import { create } from 'gc-hook';

import handleEvent from './events.js';

import DEBUG from '../debug.js';

const { isArray } = Array;

export default /** @type {import('../main.js').Coincident} */ options => {
  const exports = coincident(options);
  const { Worker: $Worker } = exports;

  const toEntry = value => {
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

  class Worker extends $Worker {
    constructor(url, options) {
      const { proxy } = super(url, options);
      const { [WORKER]: __worker__ } = proxy;

      const proxies = new Map();
      const onGC = ref => {
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
                      if (args.at(0) instanceof Event) handleEvent(...args);
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

      const asDescriptor = (descriptor, asEntry) => {
        const { get, set, value } = descriptor;
        if (get) descriptor.get = asEntry(get);
        if (set) descriptor.set = asEntry(set);
        if (value) descriptor.value = asEntry(value);
        return descriptor;
      };

      proxy[MAIN] = (TRAP, ref, ...args) => {
        if (TRAP === DESTRUCT) drop(ref);
        else {
          const method = Reflect[TRAP];
          const target = ref == null ? globalThis : get(ref);
          switch (TRAP) {
            case DEFINE_PROPERTY: {
              const [name, descriptor] = args.map(fromEntry);
              return toEntry(method(target, name, descriptor));
            }
            case GET_OWN_PROPERTY_DESCRIPTOR: {
              const value = method(target, ...args.map(fromEntry));
              return [numeric[value ? OBJECT : UNDEFINED], value && asDescriptor(value, toEntry)];
            }
            case OWN_KEYS: return [numeric[ARRAY], method(target).map(toEntry)];
            default: return asEntry(method, target, args);
          }
        }
      };

      if (DEBUG) {
        const debug = proxy[MAIN];
        proxy[MAIN] = (TRAP, ...args) => {
          const destructing = TRAP === DESTRUCT;
          const method = destructing ? console.warn : console.log;
          method('Main before', TRAP, ...args);
          const result = debug(TRAP, ...args);
          if (!destructing) method('Main after', TRAP, result);
          return result;
        };
      }
    }
  }

  return { ...exports, Worker };
};
