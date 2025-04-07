import { minByteLength } from '../utils.js';
import littleEndian from './endian.js';
import types from './types.js';

const { min } = Math;
const { defineProperty } = Object;
const { fromCharCode } = String;

const toFloat = data => {
  i += 8;
  return data.getFloat64(i - 8, littleEndian);
};

const toUint = data => {
  switch (data.getUint8(i++)) {
    case types.u8:
      return data.getUint8(i++);
    case types.u16: {
      i += 2;
      return data.getUint16(i - 2, littleEndian);
    }
    case types.u32: {
      i += 4;
      return data.getUint32(i - 4, littleEndian);
    }
    default: return toFloat(data);
  }
};

const unflatten = (data, cache) => {
  const index = i++;
  switch (data.getUint8(index)) {
    case types.array: {
      const array = [];
      cache.set(index, array);
      const length = toUint(data);
      for (let j = 0; j < length; j++)
        array[j] = unflatten(data, cache);
      return array;
    }
    case types.object: {
      const object = {};
      cache.set(index, object);
      const length = toUint(data);
      for (let j = 0; j < length; j++) {
        const key = unflatten(data, cache);
        if (key !== ignored)
          object[key] = unflatten(data, cache);
      }
      return object;
    }
    case types.string: {
      const length = toUint(data);
      const byteLength = length * 2;
      // TODO: test if piling up data.getUint16(i, littleEndian) is faster
      const buffer = data.buffer.slice(i, i + byteLength);
      const ui16a = new Uint16Array(buffer, 0, length);
      let string = '';
      for (let j = 0; j < length; j += minByteLength) {
        const next = min(j + minByteLength, length);
        string += fromCharCode.apply(null, ui16a.subarray(j, next));
      }
      cache.set(index, string);
      i += byteLength;
      return string;
    }
    case types.buffer: {
      const byteLength = toUint(data);
      const maxByteLength = toUint(data);
      const args = [byteLength];
      if (maxByteLength) args.push({ maxByteLength });
      const buffer = new ArrayBuffer(...args);
      cache.set(index, buffer);
      new Uint8Array(buffer).set(new Uint8Array(data.buffer, i, byteLength));
      i += byteLength;
      return buffer;
    }
    case types.view: {
      const name = unflatten(data, cache);
      const byteOffset = toUint(data);
      const view = new globalThis[name](unflatten(data, cache), byteOffset);
      cache.set(index, view);
      return view;
    }
    case types.date: {
      const date = new Date(toUint(data));
      cache.set(index, date);
      return date;
    }
    case types.map: {
      const size = toUint(data);
      const map = new Map;
      cache.set(index, map);
      for (let j = 0; j < size; j++) {
        const key = unflatten(data, cache);
        if (key !== ignored)
          map.set(key, unflatten(data, cache));
      }
      return map;
    }
    case types.set: {
      const size = toUint(data);
      const set = new Set;
      cache.set(index, set);
      for (let j = 0; j < size; j++) {
        const value = unflatten(data, cache);
        if (value !== ignored)
          set.add(value);
      }
      return set;
    }
    case types.regexp: {
      const source = unflatten(data, cache);
      const flags = unflatten(data, cache);
      const regexp = new RegExp(source, flags);
      cache.set(index, regexp);
      return regexp;
    }
    case types.error: {
      const Class = globalThis[unflatten(data, cache)] || Error;
      const message = unflatten(data, cache);
      const stack = unflatten(data, cache);
      const error = new Class(message);
      cache.set(index, defineProperty(error, 'stack', { value: stack }));
      return error;
    }
    case types.ref: return cache.get(toUint(data));
    // no cache needed for these
    case types.i8: return data.getInt8(i++);
    case types.i16: {
      i += 2;
      return data.getInt16(i - 2, littleEndian);
    }
    case types.i32: {
      i += 4;
      return data.getInt32(i - 4, littleEndian);
    }
    case types.f64: {
      i += 8;
      return data.getFloat64(i - 8, littleEndian);
    }
    case types.b64: {
      i += 8;
      return data.getBigInt64(i - 8, littleEndian);
    }
    case types.true: return true;
    case types.false: return false;
    case types.null: return null;
    case types.undefined: return void 0;
    case types.ignore: return ignored;
    case types.symbol: {
      const name = unflatten(data, cache);
      return name.startsWith('Symbol.') ? Symbol[name.split('.')[1]] : Symbol.for(name);
    }
    default:
      throw new Error(`Unknown type: ${data.getUint8(i - 1)}`);
  }
};

const ignored = Symbol();

let i = 0;

export const decode = (buffer, byteOffset = 0) => {
  i = byteOffset;
  return unflatten(new DataView(buffer), new Map);
};

export const decoder = ({ byteOffset }) => (_, buffer) => decode(buffer, byteOffset);
