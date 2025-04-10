const {
  assign,
  create,
} = Object;

/* c8 ignore start */
let ID = 'coincident-', native = true;
try {
  new SharedArrayBuffer(4, { maxByteLength: 8 });
  ID += crypto.randomUUID();
}
catch (_) {
  native = false;
  ID += Math.random().toString(36).substring(2);
}
/* c8 ignore end */

const byteOffset = 2 * Int32Array.BYTES_PER_ELEMENT;
const minByteLength = 0xFFFF;
const maxByteLength = 0x1000000;

const defaults = {
  // ⚠️ mandatory: first int32 to notify, second one to store the written length
  byteOffset,
  // ⚠️ mandatory: to encode *into* a SharedArrayBuffer
  useUTF16: true,
  // ⚠️ mandatory: to satisfy circular/cyclic data
  circular: true,
};

const map = new Map;
const rtr = ($, id = 0) => [
  uid => {
    const wr = withResolvers();
    do { uid = $(id++) }
    while (map.has(uid));
    map.set(uid, wr);
    return [uid, wr];
  },
  (uid, value, error) => {
    const wr = map.get(uid);
    map.delete(uid);
    if (error) wr.reject(error);
    else wr.resolve(value);
  },
];

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

const withResolvers = () => Promise.withResolvers();

export {
  ID,
  assign,
  create,
  defaults,
  maxByteLength,
  minByteLength,
  native,
  result,
  rtr,
  set,
  stop,
  withResolvers,
};
