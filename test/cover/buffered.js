import * as buffered from '../../dist/buffered.js';
import { minByteLength, maxByteLength } from '../../src/utils.js';

const encode = value => {
  buffered.encode(value, sab);
  return ui8a;
};

const decode = ui8a => buffered.decode(ui8a.buffer);

var sab = new SharedArrayBuffer(minByteLength, { maxByteLength: maxByteLength * 100 });
var ui8a = new Uint8Array(sab);

var buffer = new ArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT);
var i32a = new Int32Array(buffer, Int32Array.BYTES_PER_ELEMENT);
i32a[0] = 1;

console.assert(decode(encode(i32a)).byteOffset === Int32Array.BYTES_PER_ELEMENT, 18);

var buffer = new ArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT, { maxByteLength: 4 * Int32Array.BYTES_PER_ELEMENT });
var i32a = new Int32Array(buffer, Int32Array.BYTES_PER_ELEMENT);
i32a[0] = 1;

console.assert(decode(encode(i32a)).buffer.resizable, 24);
console.assert(decode(encode(new Uint8Array(buffer))).buffer.resizable, 25);

var arr = [i32a, new Uint8Array(buffer)];
var result = decode(encode(arr));
console.assert(result[0].buffer === result[1].buffer, 29);

let line = 31;
console.assert(encode(1), ++line);
console.assert(encode(true), ++line);
console.assert(encode(false), ++line);
console.assert(encode(null), ++line);
console.assert(encode(undefined), ++line);
console.assert(encode(NaN), ++line);
console.assert(encode(Infinity), ++line);
console.assert(encode(-Infinity), ++line);
console.assert(decode(encode(1)) === 1, ++line);
console.assert(decode(encode(true)) === true, ++line);
console.assert(decode(encode(false)) === false, ++line);
console.assert(decode(encode(null)) === null, ++line);
console.assert(decode(encode(undefined)) === undefined, ++line);
console.assert(!decode(encode(NaN)), ++line);
console.assert(!decode(encode(Infinity)), ++line);
console.assert(!decode(encode(-Infinity)), ++line);
console.assert(encode(['a', '!', 'a']), ++line);
console.assert(decode(encode(['a', '!', 'a'])).join(',') === 'a,!,a', ++line);
console.assert(encode({ a: 1, [1]: 'a' }), ++line);
console.assert(decode(encode({ a: 1, [1]: 'a' })).a === 1, ++line);
console.assert(decode(encode({ a: 1, [1]: 'a' }))[1] === 'a', ++line);
console.assert(encode([Symbol.iterator, Symbol.for('iterator')]), ++line);
console.assert(decode(encode([Symbol.iterator, Symbol.for('iterator')]))[0] === Symbol.iterator, ++line);  
console.assert(decode(encode([Symbol.iterator, Symbol.for('iterator')]))[1] === Symbol.for('iterator'), ++line);
console.assert(decode(encode(123n)) === 123n, ++line);
console.assert(typeof decode(encode(123n)) === 'bigint', ++line);

var now = Date.now();
line = 60;
console.assert(encode(new Date(now)), ++line);
console.assert(decode(encode(new Date(now))) instanceof Date, ++line);
console.assert(decode(encode(new Date(now))).getTime() === now, ++line);
console.assert(encode({a: void 0, b: 2, [Symbol('!')]: 3}), ++line);
console.assert(decode(encode({a: void 0, b: 2})).a === undefined, ++line);
console.assert(decode(encode({a: void 0, b: 2})).b === 2, ++line);
console.assert(decode(encode({a: void 0, b: 2})).a === undefined, ++line);
console.assert(encode({a: 1, b: 2, c: 3}), ++line);
console.assert(decode(encode({a: 1, b: 2, c: 3})).a === 1, ++line);
console.assert(decode(encode({a: 1, b: 2, c: 3})).b === 2, ++line);
console.assert(decode(encode({a: 1, b: 2, c: 3})).c === 3, ++line);
console.assert(encode([1, void 0, 2, function () {}, 3]), ++line);
console.assert(decode(encode([1, void 0, 2, function () {}, 3]))[2] === 2, ++line);
console.assert(decode(encode([1, void 0, 2, function () {}, 3]))[3] === undefined, ++line);

console.assert(encode({toJSON(){ return this}}), 76);
console.assert(JSON.stringify(decode(encode({toJSON(){ return this}}))) === '{}', 77);

var obj = { ok: true };
var wrap = { toJSON(){ return obj }};
console.assert(encode(wrap), 81);
console.assert(encode([wrap, obj, wrap]), 82);
console.assert(decode(encode([wrap, obj, wrap])).every((v, i, arr) => v === arr[0]), 83);
console.assert(encode(Symbol()), 84);


var set = new Set([1, void 0, 2]);
console.assert(decode(encode(set)).has(1), 80);
console.assert(decode(encode(set)).has(2), 81);
console.assert(decode(encode(set)).size === 2, 82);

var map = new Map([[1, void 0], [2, 1]]);
console.assert(!decode(encode(map)).has(1), 84);
console.assert(decode(encode(map)).get(2) === 1, 85);
console.assert(decode(encode(map)).size === 1, 86);

var error = new TypeError('test', { cause: 'because' });
var arr = [1, error, 2];
console.assert(decode(encode(arr))[1].name === 'TypeError', 99);
console.assert(decode(encode(arr))[1].message === 'test', 100);
console.assert(decode(encode(arr))[2] === 2, 101);
console.assert(decode(encode(arr))[0] === 1, 102);

var re = /test/gim;
console.assert(decode(encode(re)).source === 'test', 106);
console.assert(decode(encode(re)).flags === 'gim', 107);

class TestError extends Error {
  get name() { return 'TestError' }
}
console.assert(decode(encode(new TestError)).name === 'Error', 111);
console.assert(decode(encode(new TestError('test', { cause: 'because' }))).message === 'test', 112);

var decoded = decode(encode([re, {toJSON: () => re}]));
console.assert(decoded[0] === decoded[1], 115);

var decoded = decode(encode([error, {toJSON: () => error}]));
console.assert(decoded[0] === decoded[1], 120);

console.assert(decode(encode(undefined)) === void 0, 120);
try {
  decode(encode(127))
}
catch (_) {
  console.log('OK');
}

line = 127;
console.assert(decode(encode(0xFF)) === 0xFF, ++line);
console.assert(decode(encode(0xFFFF)) === 0xFFFF, ++line);
console.assert(decode(encode(0xFFFFFFFF)) === 0xFFFFFFFF, ++line);
console.assert(decode(encode(-0xFF)) === -0xFF, ++line);
console.assert(decode(encode(-0xFFFF)) === -0xFFFF, ++line);
console.assert(decode(encode(-0xFFFFFFFF)) === -0xFFFFFFFF, ++line);

console.assert(decode(encode(new Array(0xFFFFF))), ++line);
console.assert(decode(encode(1.23)) === 1.23, ++line);

class UI8A extends Uint8Array {}
const ab = new ArrayBuffer(10);
console.assert(decode(encode(new UI8A(2))) instanceof Uint8Array, 141);
console.assert(decode(encode(new UI8A(ab, 2, 4))) instanceof Uint8Array, 142);
console.assert(decode(encode(new Uint8Array(ab, 2, 4))).byteOffset === 2, 143);
console.assert(decode(encode(new Uint8Array(ab, 2, 4))).length === 4, 144);
