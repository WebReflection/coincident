let search = '';
if (/\?(buffered|flatted|json|structured)$/.test(location.search)) search = `_${RegExp.$1}`;

const { default: coincident } = await import(`../../dist/main${search}.js`);

const { Worker, native } = coincident();

console.info('main', { native });

const w = new Worker(`./worker${search}.js`, { type: 'module' });

w.proxy.alert = (...args) => {
  // console.info('main', 'alert', args);
  return args;
};

console.log('worker: async', await w.proxy.log(4, 5, 6));
