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
const identity = value => value;
const rtr = ($ = identity, id = 0) => [
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

const result = async (uid, callback, args, transform) => {
  const response = [uid, null, null];
  try {
    const result = await callback(...args);
    response[1] = transform ? transform(result) : result;
  }
  catch (error) { response[2] = error }
  return response;
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

const ui8View = buffer => new Uint8Array(buffer, byteOffset);

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
  ui8View,
  withResolvers,
};
