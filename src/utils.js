import {
  ARRAY,
  BIGINT,
  BOOLEAN,
  FUNCTION,
  NULL,
  NUMBER,
  OBJECT,
  STRING,
  SYMBOL,
  UNDEFINED,
} from 'js-proxy/types';

// ℹ️ boosts common keys performance
export const mirrored = [
  ARRAY,
  BIGINT,
  BOOLEAN,
  FUNCTION,
  NULL,
  NUMBER,
  OBJECT,
  STRING,
  SYMBOL,
  UNDEFINED,
];

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

export const set = (proxied, name, callback) => {
  if (typeof callback === 'function') {
    proxied[name] = callback;
    return true;
  }
  return false;
};
