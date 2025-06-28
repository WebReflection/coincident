import { native } from '@webreflection/utils/shared-array-buffer';

const {
  assign,
  create,
} = Object;

/* c8 ignore start */
const ID = `coincident-${native ? crypto.randomUUID() : Math.random().toString(36).substring(2)}`;
/* c8 ignore end */

const byteOffset = 2 * Int32Array.BYTES_PER_ELEMENT;
const minByteLength = 0x7FFF; // throws at 0xFFFF via .apply(...)
const maxByteLength = 0x1000000;

const defaults = {
  // ⚠️ mandatory: first int32 to notify, second one to store the written length
  byteOffset,
};

const result = async (data, proxied, transform) => {
  try {
    const result = await proxied[data[1]].apply(null, data[2]);
    data[1] = transform ? transform(result) : result;
    data[2] = null;
  }
  catch (error) { data[2] = error }
};

const set = (proxied, name, callback) => {
  const ok = name !== 'then';
  if (ok) proxied[name] = callback;
  return ok;
};

/** @param {Event} event */
const stop = event => {
  event.stopImmediatePropagation();
  event.preventDefault();
};

export const ffi_timeout = (options, fallback = -1) => (
  options?.reflected_ffi_timeout ?? fallback
);

export {
  ID,
  assign,
  create,
  defaults,
  maxByteLength,
  minByteLength,
  native,
  result,
  set,
  stop,
};
