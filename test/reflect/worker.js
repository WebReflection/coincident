import coincident from '../../dist/window/worker.js';

const { window } = await coincident();
const { document, test } = window;

console.assert(Reflect.ownKeys(test).join(',') === 'a,b');

Object.defineProperty(test, 'value', {
    configurable: true,
    value() {
        return this;
    }
});

console.assert(Object.getOwnPropertyDescriptor(test, 'value').configurable);
console.assert(await test.value() === test);

document.body.textContent = 'OK';
