export { create, stop, withResolvers } from 'sabayon/lite/utils';

const { assign } = Object;

export { assign };

export const defaults = {
  // ⚠️ mandatory: first int32 to notify, second one to store the written length
  byteOffset: 2 * Int32Array.BYTES_PER_ELEMENT,
  // ⚠️ mandatory: to encode *into* a SharedArrayBuffer
  useUTF16: true,
  // ⚠️ mandatory: to satisfy circular/cyclic data
  circular: true,
};

export const set = (proxied, name, value) => {
  proxied[name] = value;
  return true;
};

const transferred = new Set;
export const transfer = (...args) => {
  transferred.add(args);
  return args;
};

const empty = [];
export const transferable = args => {
  const l = args.length;
  if (l && transferred.has(args[l - 1])) {
    transferred.delete(args[l - 1]);
    return args.pop();
  }
  return empty;
};
