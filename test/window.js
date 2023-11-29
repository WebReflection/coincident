import coincident from '../window.js';

const {proxy, window, isWindowProxy} = coincident(self);

console.log(window[Symbol.for('coincident')]);

proxy.greetings();

const {document} = window;

const arr = window.Array(1, 2, 3);
const obj = arr[Symbol.iterator]();
console.assert(
  typeof obj.next === 'function' && (
    typeof obj[Symbol.iterator] === 'function' ||
    typeof obj[Symbol.asyncIterator] !== 'function'
));

console.assert(document.body === document.body);
console.assert(typeof document.body === 'object');
console.assert(typeof document.addEventListener === 'function');

document.body.innerHTML = '<h1>Hello World!</h1>';

document.body.addEventListener('click', event => {
  console.log(event.type);
});

console.log(document.body.querySelectorAll('*')[0].tagName);

// to log window objects in the window/main thread
window.console.log(document.body);

document.body.appendChild(document.createElement('div')).textContent = '🥳';

const remote = new window.Object;

console.assert(isWindowProxy(remote));

console.log(JSON.stringify(
  window.Object.getOwnPropertyDescriptor(window.Int32Array, 'BYTES_PER_ELEMENT')
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
console.assert(Reflect.setPrototypeOf(remote, window.Array.prototype));
console.assert(window.Reflect.preventExtensions(remote));
console.log(Reflect.ownKeys(window.Promise));
console.assert(new window.Object(123) instanceof window.Number);
console.log(window.Math.max.apply(window.Math, [1, 2]));
console.log(window.Math.max.call(window.Math, 1, 2));
console.assert(window.navigator instanceof window.Object);
console.log(window.parseInt('01', 10), parseInt('01', 10));
console.log(window.navigator.userAgent);
console.assert(Object.isExtensible(window.navigator));
console.log(window.location.href);
console.assert('length' in window.localStorage);
console.log(window.localStorage.length);
console.assert(window.Symbol.iterator === Symbol.iterator);
window.document.title = 'coincident window';
console.log(window.document.title);
new window.Promise($ => $('Promise: OK')).then(console.log).then(() => {
  console.log('Answer:', window.prompt('Have you seen the console?'));
});
