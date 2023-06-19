import coincident from '../global.js';

const {proxy, global, isGlobal} = coincident(self);

const {document} = global;
document.body.innerHTML = '<h1>Hello World!</h1>';

document.body.addEventListener('click', event => {
  console.log(event.type);
});

console.log(document.body.querySelectorAll('*')[0].tagName);

// to log global objects in the global/main thread
global.console.log(document.body);

document.body.appendChild(document.createElement('div')).textContent = '🥳';

const remote = new global.Object;

console.assert(isGlobal(remote));

console.log(JSON.stringify(
  global.Object.getOwnPropertyDescriptor(global.Int32Array, 'BYTES_PER_ELEMENT')
));

let test = 0;
Object.defineProperty(remote, 'test', {
  configurable: true,
  get: () => test++,
});

Promise.all([
  remote.test,
  remote.test,
  remote.test
]).then(results => {
  console.log(results);
  console.log(test);
});

console.assert(delete remote.key);
console.assert(Reflect.setPrototypeOf(remote, global.Array.prototype));
console.assert(global.Reflect.preventExtensions(remote));
console.log(Reflect.ownKeys(global.Promise));
console.assert(new global.Object(123) instanceof global.Number);
console.log(global.Math.max.apply(global.Math, [1, 2]));
console.log(global.Math.max.call(global.Math, 1, 2));
console.assert(global.navigator instanceof global.Object);
console.log(global.parseInt('01', 10), parseInt('01', 10));
console.log(global.navigator.userAgent);
console.assert(Object.isExtensible(global.navigator));
console.log(global.location.href);
console.assert('length' in global.localStorage);
console.log(global.localStorage.length);
console.assert(global.Symbol.iterator === Symbol.iterator);
global.document.title = 'coincident global';
console.log(global.document.title);
new global.Promise($ => $('Promise: OK')).then(console.log).then(() => {
  console.log('Answer:', global.prompt('Have you seen the console?'));
});
