const { getPrototypeOf } = Object;
export const toConstructorName = constructor => {
  while (!(constructor.name in globalThis))
    constructor = getPrototypeOf(constructor);
  return constructor.name;
};

export const toSymbolName = value => {
  const name = String(value).slice(7, -1);
  return name.startsWith('Symbol.') || Symbol.keyFor(value) ? name : '';
};

export const toSymbolValue = name => name.startsWith('Symbol.') ?
  Symbol[name.slice(name.indexOf('.') + 1)] :
  Symbol.for(name)
;

export const toType = value => {
  const type = typeof value;
  switch (type) {
    case 'function':
    case 'undefined':
      return '';
    case 'object':
      return value === null ? 'null' : 'object';
    default:
      return type;
  }
};
