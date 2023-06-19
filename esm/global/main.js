import {
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

const result = asEntry((type, value) => {
  if (!ids.has(value)) {
    // map values by id
    // map ids by value
    ids.set(value, id);
    values.set(id++, value);
  }
  return entry(type, ids.get(value));
});

export default (thread, MAIN, THREAD) => {
  const {[THREAD]: __thread__} = thread;

  const registry = new FinalizationRegistry(id => {
    __thread__(DELETE, entry(STRING, id));
  });

  const target = ({type, value}) => {
    switch (type) {
      case OBJECT:
        return value == null ? globalThis : (
          typeof value === NUMBER ? values.get(value) : value
        );
      case FUNCTION:
        if (typeof value === STRING) {
          if (!values.has(value)) {
            const cb = function (...args) {
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
      // console.log('main', DELETE, id, values.has(id));
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

  return thread;
};
