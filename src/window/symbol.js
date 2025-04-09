import { SYMBOL } from 'js-proxy/types';

const symbols = new Map;

for (const s of Reflect.ownKeys(Symbol)) {
  if (typeof Symbol[s] === SYMBOL) {
    symbols.set(Symbol[s], s);
    symbols.set(s, Symbol[s]);
  }
}

export const fromSymbol = value => (
  symbols.get(value) ||
  Symbol.for(value.slice(1))
);

export const toSymbol = value => (
  symbols.get(value) ||
  `.${Symbol.keyFor(value) || ''}`
);
