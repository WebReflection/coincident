
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
  pair,
  wrap,
} from 'proxy-target';

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

const {assign, create} = Object;

export const TypedArray = getPrototypeOf(Int8Array);

export const isArray = 'isArray';

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
      return pair(NULL, value);
    case OBJECT:
      if (value === globalThis)
        return pair(type, null);
    case ARRAY:
    case FUNCTION:
      return transform(type, value);
    case BOOLEAN:
    case NUMBER:
    case STRING:
    case UNDEFINED:
    case BIGINT:
      return pair(type, value);
    case SYMBOL: {
      if (symbols.has(value))
        return pair(type, symbols.get(value));
    }
  }
  throw new Error(`Unable to handle this ${type} type`);
});

const symbols = new Map(
  ownKeys(Symbol)
    .filter(s => typeof Symbol[s] === SYMBOL)
    .map(s => [Symbol[s], s])
);

export const symbol = value => {
  for (const [symbol, name] of symbols) {
    if (name === value)
      return symbol;
  }
};

export const transform = o => o;
