import define from 'js-proxy';
import { drop, get, hold } from 'js-proxy/heap';
import { TypedArray } from 'sabayon/shared';

import coincident from '../worker.js';
import numeric from './types.js';
import { fromSymbol, toSymbol } from './symbol.js';

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
  DESTRUCT,
} from 'js-proxy/traps';

import { ARRAY, FUNCTION, NUMBER, OBJECT, SYMBOL } from 'js-proxy/types';

import { MAIN, WORKER } from './constants.js';

import DEBUG from '../debug.js';

const { [APPLY]: apply } = Reflect;

/**
 * @callback Coincident
 * @param {import('../worker.js').WorkerOptions} [options]
 * @returns {Promise<{polyfill: boolean, transfer: (...args: Transferable[]) => Transferable[], proxy: {}, window: Window, isWindowProxy: (value: any) => boolean}>}
 */

export default /** @type {Coincident} */ async options => {
  const exports = await coincident(options);
  const $ = options?.transform || ((o) => o);
  const { [MAIN]: __main__ } = exports.proxy;

  const proxies = new Map();
  const proxied = (value, proxy) => {
    let ref = proxies.get(value)?.deref();
    if (!ref) proxies.set(value, new WeakRef((ref = proxy(value))));
    return ref;
  };

  const fromEntry = ([numericTYPE, value]) => {
    switch (numericTYPE) {
      case numeric[OBJECT]: return (
        value == null ?
          globalThis :
          typeof value === NUMBER ?
            proxied(value, proxy.object) :
            value
      );
      case numeric[ARRAY]: return typeof value === NUMBER ? proxied(value, proxy.array) : value;
      case numeric[FUNCTION]: return (
        typeof value === NUMBER ?
          proxied(value, proxy.function) :
          get(parseInt(value))
      );
      case numeric[SYMBOL]: return fromSymbol(value);
      default: return value;
    }
  };

  const toEntry = value => {
    let [TYPE, ref] = pair(value);
    switch (TYPE) {
      case OBJECT: {
        if (ref == globalThis || ref == null) ref = null;
        else if ((typeof ref === OBJECT) && !(ref instanceof TypedArray)) {
          ref = $(ref);
          for (const key in ref) ref[key] = toEntry(ref[key]);
        }
        return [numeric[OBJECT], ref];
      }
      case ARRAY: {
        return [numeric[ARRAY], typeof ref === NUMBER ? ref : $(ref).map(toEntry)];
      }
      case FUNCTION: {
        // own local functions as String(id)
        return [numeric[FUNCTION], typeof ref === FUNCTION ? String(hold($(ref))) : ref];
      }
      case SYMBOL: return [numeric[SYMBOL], toSymbol(value)];
      default: return [numeric[TYPE], ref];
    }
  };

  const asEntry = (...args) => fromEntry(__main__(...args));

  const handler = {
    [DEFINE_PROPERTY]: (ref, name, descriptor) => asEntry(DEFINE_PROPERTY, ref, toEntry(name), toEntry(descriptor)),
    [DELETE_PROPERTY]: (ref, name) => asEntry(DELETE_PROPERTY, ref, toEntry(name)),
    [GET]: (ref, name) => asEntry(GET, ref, toEntry(name)),
    [GET_PROTOTYPE_OF]: (ref) => asEntry(GET_PROTOTYPE_OF, ref),
    [GET_OWN_PROPERTY_DESCRIPTOR]: (ref, name) => {
      const descriptor = asEntry(GET_OWN_PROPERTY_DESCRIPTOR, ref, toEntry(name));
      if (descriptor) {
        const { get, set, value } = descriptor;
        if (get) descriptor.get = fromEntry(get);
        if (set) descriptor.set = fromEntry(set);
        if (value) descriptor.value = fromEntry(value);
      }
      return descriptor;
    },
    [HAS]: (ref, name) => asEntry(HAS, ref, toEntry(name)),
    [IS_EXTENSIBLE]: (ref) => asEntry(IS_EXTENSIBLE, ref),
    [OWN_KEYS]: (ref) => asEntry(OWN_KEYS, ref).map(fromEntry),
    [PREVENT_EXTENSION]: (ref) => asEntry(PREVENT_EXTENSION, ref),
    [SET]: (ref, name, value) => asEntry(SET, ref, toEntry(name), toEntry(value)),
    [SET_PROTOTYPE_OF]: (ref, proto) => asEntry(SET_PROTOTYPE_OF, ref, toEntry(proto)),

    [DESTRUCT](ref) {
      proxies.delete(ref);
      __main__(DESTRUCT, ref);
    },
  };

  let definition = {
    object: handler,
    array: handler,
    function: {
      ...handler,
      [APPLY]: (ref, ...args) => asEntry(APPLY, ref, ...args.map(toEntry)),
      [CONSTRUCT]: (ref, ...args) => asEntry(CONSTRUCT, ref, ...args.map(toEntry)),
    },
  };

  if (DEBUG) {
    const augment = handler => {
      for (const key in handler) {
        const method = handler[key];
        handler[key] = function (...args) {
          console.log('Proxy handler before', key, ...args);
          const result = method.apply(this, args);
          if (key !== DESTRUCT) console.log('Proxy handler after', key, result);
          return result;
        };
      }
    };
    augment(handler);
    augment(definition.function);
  }

  const { proxy, isProxy, pair } = define(definition);

  const window = proxy.object(null);

  // for the time being this is used only to invoke callbacks
  // attached as listeners or as references' fields.
  exports.proxy[WORKER] = (TRAP, ref, ...args) => {
    const id = parseInt(ref);
    switch (TRAP) {
      case APPLY: {
        const [self, params] = args;
        return toEntry(apply(get(id), fromEntry(self), params.map(fromEntry)));
      }
      case DESTRUCT:
        drop(id);
    }
  };

  if (DEBUG) {
    const debug = exports.proxy[WORKER];
    exports.proxy[WORKER] = (TRAP, ...args) => {
      const destructing = TRAP === DESTRUCT;
      const method = destructing ? console.warn : console.log;
      method('Worker before', TRAP, ...args);
      const result = debug(TRAP, ...args);
      if (!destructing) method('Worker after', TRAP, result);
      return result;
    };
  }

  return { ...exports, window, isWindowProxy: isProxy };
};
