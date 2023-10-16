
import {
  OBJECT,
  FUNCTION,
  BOOLEAN,
  NUMBER,
  STRING,
  UNDEFINED,
  BIGINT,
  SYMBOL,
  NULL
} from './types.js';

const {
  defineProperty,
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

export const entry = (type, value) => [type, value];

export const asEntry = transform => value => {
  const type = typeof value;
  switch (type) {
    case OBJECT:
    if (value == null)
      return entry(NULL, value);
    if (value === globalThis)
      return entry(OBJECT, null);
    case FUNCTION:
      return transform(type, value);
    case BOOLEAN:
    case NUMBER:
    case STRING:
    case UNDEFINED:
    case BIGINT:
      return entry(type, value);
    case SYMBOL: {
      if (symbols.has(value))
        return entry(type, symbols.get(value));
    }
  }
  throw new Error(`Unable to handle this ${type} type`);
};

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

export function Bound() {
  return this;
}
