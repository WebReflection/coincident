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
