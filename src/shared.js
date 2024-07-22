// (c) Andrea Giammarchi - MIT

import {
  ACTION_INIT,
  ACTION_NOTIFY,
  ACTION_WAIT,
  Atomics,
  isChannel,
  withResolvers,
} from 'sabayon/shared';

const { BYTES_PER_ELEMENT: I32_BYTES } = Int32Array;
const { BYTES_PER_ELEMENT: UI16_BYTES } = Uint16Array;

const { notify } = Atomics;

const decoder = new TextDecoder('utf-16');

const buffers = new WeakSet;

/**
 * @param  {...Transferable} args
 */
const transfer = (...args) => (buffers.add(args), args);

let seppuku = '';
const results = new Map;
const actionLength = (stringify, transform) => async (callback, [name, id, sb, args, isSync]) => {
  if (isSync) seppuku = name;
  try {
    const result = await callback(...args);
    if (result !== void 0) {
      const serialized = stringify(transform ? transform(result) : result);
      results.set(id, serialized);
      sb[1] = serialized.length;
    }
  }
  finally {
    if (isSync) seppuku = '';
    sb[0] = 1;
    notify(sb, 0);
  }
};
const actionFill = (id, sb) => {
  const result = results.get(id);
  results.delete(id);
  for (let ui16a = new Uint16Array(sb.buffer), i = 0, { length } = result; i < length; i++)
    ui16a[i] = result.charCodeAt(i);
  notify(sb, 0);
};
const actionWait = (waitLength, map, rest) => {
  const [name] = rest;
  const callback = map.get(name);
  if (!callback) throw new Error(`Unknown proxy.${name}()`);
  waitLength(callback, rest);
};

const warn = (name, seppuku) => setTimeout(
  console.warn,
  1000,
  `💀🔒 - proxy.${name}() in proxy.${seppuku}()`
);

let uid = 0;
const invoke = (
  [
    CHANNEL,
    Int32Array,
    SharedArrayBuffer,
    ignore,
    isSync,
    parse,
    polyfill,
    postMessage,
    transform,
    waitAsync,
  ],
  name,
) => (...args) => {
  let deadlock = seppuku !== '', timer = 0;
  if (deadlock) timer = warn(name, seppuku);
  const id = uid++;
  const transfer = [];
  if (buffers.has(args.at(-1) || transfer))
    buffers.delete(transfer = args.pop());
  const data = ignore(transform ? args.map(transform) : args);
  let sb = new Int32Array(new SharedArrayBuffer(I32_BYTES * 2));
  postMessage([CHANNEL, ACTION_WAIT, name, id, sb, data, isSync], { transfer });
  return waitAsync(sb, 0).value.then(() => {
    if (deadlock) clearTimeout(timer);
    const length = sb[1];
    if (!length) return;
    const bytes = UI16_BYTES * length;
    sb = new Int32Array(new SharedArrayBuffer(bytes + (bytes % I32_BYTES)));
    postMessage([CHANNEL, ACTION_NOTIFY, id, sb]);
    return waitAsync(sb, 0).value.then(() =>{
      const ui16a = new Uint16Array(sb.buffer);
      const sub = polyfill ? ui16a.subarray(0, length) : ui16a.slice(0, length);
      return parse(decoder.decode(sub));
    });
  });
};

const createProxy = (details, map) => new Proxy(map, {
  get: (map, name) => (
    map.get(name) ||
    map.set(name, invoke(details, name)).get(name)
  ),
  set: (map, name, callback) => !!map.set(name, callback),
});

export {
  ACTION_INIT,
  ACTION_WAIT,
  ACTION_NOTIFY,

  actionLength,
  actionFill,
  actionWait,

  createProxy,

  isChannel,
  transfer,

  withResolvers,
};
