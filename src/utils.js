const {
  assign,
  create,
} = Object;

let ID = 'coincident-', native = true;
try {
  new SharedArrayBuffer(4, { maxByteLength: 8 });
  ID += crypto.randomUUID();
}
catch (_) {
  native = false;
  ID += Math.random().toString(36).substring(2);
}

const defaults = {
  // ⚠️ mandatory: first int32 to notify, second one to store the written length
  byteOffset: 2 * Int32Array.BYTES_PER_ELEMENT,
  // ⚠️ mandatory: to encode *into* a SharedArrayBuffer
  useUTF16: true,
  // ⚠️ mandatory: to satisfy circular/cyclic data
  circular: true,
};

const resolve = (promises, uid, value, error) => {
  const wr = promises.get(uid);
  promises.delete(uid);
  if (error) wr.reject(error);
  else wr.resolve(value);
};

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
  if (name !== 'then' && typeof callback === 'function') {
    proxied[name] = callback;
    return true;
  }
  return false;
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
  native,
  resolve,
  result,
  set,
  stop,
  withResolvers,
};
