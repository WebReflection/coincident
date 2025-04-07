import { decode, encode } from '../../dist/flatted.js';

var buffer = new ArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT);
var i32a = new Int32Array(buffer, Int32Array.BYTES_PER_ELEMENT);
i32a[0] = 1;

console.assert(!decode(encode(i32a)).buffer.resizable, 8);
console.assert(decode(encode(i32a)).byteOffset === Int32Array.BYTES_PER_ELEMENT, 9);

var buffer = new ArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT, { maxByteLength: 4 * Int32Array.BYTES_PER_ELEMENT });
var i32a = new Int32Array(buffer, Int32Array.BYTES_PER_ELEMENT);
i32a[0] = 1;

console.assert(decode(encode(i32a)).buffer.resizable, 15);
console.assert(decode(encode(new Uint8Array(buffer))).buffer.resizable, 16);

var arr = [i32a, new Uint8Array(buffer)];
var result = decode(encode(arr));
console.assert(result[0].buffer === result[1].buffer, 20);

let line = 21;
console.assert(encode(1) === '[3,1]', ++line);
console.assert(encode(true) === '[5]', ++line);
console.assert(encode(false) === '[6]', ++line);
console.assert(encode(null) === '[7]', ++line);
console.assert(encode(undefined) === '[13]', ++line);
console.assert(encode(NaN) === '[3,null]', ++line);
console.assert(encode(Infinity) === '[3,null]', ++line);
console.assert(encode(-Infinity) === '[3,null]', ++line);
console.assert(decode('[3,1]') === 1, ++line);
console.assert(decode('[5]') === true, ++line);
console.assert(decode('[6]') === false, ++line);
console.assert(decode('[7]') === null, ++line);
console.assert(decode('[]') === undefined, ++line);
console.assert(decode('[3,null]') === null, ++line);
console.assert(decode('[3,null]') === null, ++line);
console.assert(decode('[3,null]') === null, ++line);
console.assert(encode(['a', '!', 'a']) === '[1,3,4,"a",4,"!",0,2]', ++line);
console.assert(decode('[1,3,4,"a",4,"!",0,2]').join(',') === 'a,!,a', ++line);
console.assert(encode({ a: 1, [1]: 'a' }) === '[2,2,4,"1",4,"a",0,4,3,1]', ++line);
console.assert(decode('[2,2,4,"1",4,"a",0,4,3,1]').a === 1, ++line);
console.assert(decode('[2,2,4,"1",4,"a",0,4,3,1]')[1] === 'a', ++line);
console.assert(encode([Symbol.iterator, Symbol.for('iterator')]) === '[1,2,10,"Symbol.iterator",10,"iterator"]', ++line);
console.assert(decode('[1,2,10,"Symbol.iterator",10,"iterator"]')[0] === Symbol.iterator, ++line);  
console.assert(decode('[1,2,10,"Symbol.iterator",10,"iterator"]')[1] === Symbol.for('iterator'), ++line);
console.assert(encode(123n) === '[12,"123"]', ++line);
console.assert(decode('[12,"123"]') === 123n, ++line);
console.assert(typeof decode('[12,"123"]') === 'bigint', ++line);

var now = Date.now();
line = 51;
console.assert(encode(new Date(now)) === `[11,${now}]`, ++line);
console.assert(decode(`[11,${now}]`) instanceof Date, ++line);
console.assert(decode(`[11,${now}]`).getTime() === now, ++line);
console.assert(encode({a: void 0, b: 2, [Symbol('!')]: 3}) === '[2,1,4,"b",3,2]', ++line);
console.assert(decode(encode({a: void 0, b: 2})).a === undefined, ++line);
console.assert(decode('[2,1,4,"b",3,2]').b === 2, ++line);
console.assert(decode('[2,1,4,"b",3,2]').a === undefined, ++line);
console.assert(encode({a: 1, b: 2, c: 3}) === '[2,3,4,"a",3,1,4,"b",3,2,4,"c",3,3]', ++line);
console.assert(decode('[2,3,4,"a",3,1,4,"b",3,2,4,"c",3,3]').a === 1, ++line);
console.assert(decode('[2,3,4,"a",3,1,4,"b",3,2,4,"c",3,3]').b === 2, ++line);
console.assert(decode('[2,3,4,"a",3,1,4,"b",3,2,4,"c",3,3]').c === 3, ++line);
console.assert(encode([1, void 0, 2, function () {}, 3]) === '[1,5,3,1,13,3,2,13,3,3]', ++line);
console.assert(decode('[1,5,3,1,7,3,2,7,3,3]')[2] === 2, ++line);
console.assert(decode('[1,5,3,1,7,3,2,7,3,3]')[3] === null, ++line);

console.assert(encode({toJSON(){ return this}}) === '[2,0]', 68);
console.assert(JSON.stringify(decode('[2,0]')) === '{}', 69);

var obj = { ok: true };
var wrap = { toJSON(){ return obj }};
console.assert(encode(wrap) === '[2,1,4,"ok",5]', 73);
console.assert(encode([wrap, obj, wrap]) === '[1,3,2,1,4,"ok",5,0,2,0,2]', 74);
console.assert(decode(encode([wrap, obj, wrap])).every((v, i, arr) => v === arr[0]), 75);
console.assert(encode(Symbol()) === '[]', 76);


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
console.assert(decode(encode(arr))[1].name === 'TypeError', 91);
console.assert(decode(encode(arr))[1].cause === 'because', 92);
console.assert(decode(encode(arr))[1].message === 'test', 93);
console.assert(decode(encode(arr))[2] === 2, 94);
console.assert(decode(encode(arr))[0] === 1, 95);

var re = /test/gim;
console.assert(decode(encode(re)).source === 'test', 98);
console.assert(decode(encode(re)).flags === 'gim', 99);

class TestError extends Error {
  get name() { return 'TestError' }
}
console.assert(decode(encode(new TestError)).name === 'Error', 104);
console.assert(decode(encode(new TestError('test', { cause: 'because' }))).cause === 'because', 105);
console.assert(decode(encode(new TestError('test', { cause: 'because' }))).message === 'test', 106);

var decoded = decode(encode([re, {toJSON: () => re}]));
console.assert(decoded[0] === decoded[1], 108);

var decoded = decode(encode([error, {toJSON: () => error}]));
console.assert(decoded[0] === decoded[1], 111);

console.assert(decode('[13]') === void 0, 107);
try {
  decode('[127]')
}
catch (_) {
  console.log('OK');
}
