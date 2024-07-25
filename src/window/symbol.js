import { OWN_KEYS } from 'js-proxy/traps';
import { SYMBOL } from 'js-proxy/types';

const { [OWN_KEYS]: ownKeys } = Reflect;

const known = new Map(
  ownKeys(Symbol)
    .filter(s => typeof Symbol[s] === SYMBOL)
    .map(s => [Symbol[s], s])
);

export const fromSymbol = value => {
  if (value.startsWith('.'))
    return Symbol.for(value.slice(1));
  for (const [symbol, name] of known) {
    if (name === value)
      return symbol;
  }
};

export const toSymbol = value => (
  known.get(value) ||
  `.${Symbol.keyFor(value) || ''}`
);
