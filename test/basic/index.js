let search = '';
if (/\?(buffered|flatted|json|structured)$/.test(location.search)) search = `_${RegExp.$1}`;

const { default: coincident } = await import(`../../dist/main${search}.js`);

const { Worker, native } = coincident();

console.info('main', { native });

const w = new Worker(`./worker${search}.js`, { type: 'module' });

const byteOffset = 8;

const callback = async (...args) => Promise.resolve(args);

w.addEventListener('message', async ({ data }) => {
  const [i32a, name, args] = data;
  globalThis.lastName = name;
  const buffer = i32a.buffer;
  let result;
  try {
    result = await callback(...args);
  }
  catch (error) {
    result = error;
  }
  let length = 0;
  if (result !== void 0) {
    const string = JSON.stringify(result);
    length = string.length;
    const size = length * 2 + byteOffset;
    if (buffer.byteLength < size) buffer.grow(size);
    const ui16a = new Uint16Array(buffer, byteOffset, length);
    for (let i = 0; i < length; i++)
      ui16a[i] = string.charCodeAt(i);
  }
  i32a[1] = length;
  i32a[0] = 1;
  Atomics.notify(i32a, 0);
});

w.proxy.alert = (...args) => {
  // console.info('main', 'alert', args);
  return args;
};

console.log('worker: async', await w.proxy.log(4, 5, 6));
