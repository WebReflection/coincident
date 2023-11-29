import { target as tv, wrap } from 'proxy-target/array';

import {
  ARRAY,
  OBJECT,
  FUNCTION,
  BOOLEAN,
  NUMBER,
  STRING,
  UNDEFINED,
  BIGINT,
  SYMBOL,
  NULL,
} from 'proxy-target/types';

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

export const TypedArray = getPrototypeOf(Int8Array);

export {
  assign,
  create,
  defineProperty,
  deleteProperty,
  getOwnPropertyDescriptor,
  getPrototypeOf,
  isExtensible,
  ownKeys,
  preventExtensions,
  set,
  setPrototypeOf
};

export const augment = (descriptor, how) => {
  const {get, set, value} = descriptor;
  if (get) descriptor.get = how(get);
  if (set) descriptor.set = how(set);
  if (value) descriptor.value = how(value);
  return descriptor;
};

export const asEntry = transform => value => wrap(value, (type, value) => {
  switch (type) {
    case NULL:
      return tv(NULL, value);
    case OBJECT:
      if (value === globalThis)
        return tv(type, null);
    case ARRAY:
    case FUNCTION:
      return transform(type, value);
    case BOOLEAN:
    case NUMBER:
    case STRING:
    case UNDEFINED:
    case BIGINT:
      return tv(type, value);
    case SYMBOL: {
      // handle known symbols
      if (symbols.has(value))
        return tv(type, symbols.get(value));
      // handle `Symbol.for('...')` cases
      let key = Symbol.keyFor(value);
      if (key)
        return tv(type, `.${key}`);
    }
  }
  throw new TypeError(`Unable to handle this ${type}: ${String(value)}`);
});

const symbols = new Map(
  ownKeys(Symbol)
    .filter(s => typeof Symbol[s] === SYMBOL)
    .map(s => [Symbol[s], s])
);

export const symbol = value => {
  if (value.startsWith('.'))
    return Symbol.for(value.slice(1));
  for (const [symbol, name] of symbols) {
    if (name === value)
      return symbol;
  }
};

export const transform = o => o;
