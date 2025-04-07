import { minByteLength } from '../utils.js';
import littleEndian from './endian.js';
import types from './types.js';
import { toType } from '../utils/shared.js';

const { isArray } = Array;
const { isView } = ArrayBuffer;
const { isInteger, isFinite } = Number;
const { entries } = Object;

// numbers
const toInt = (buffer, value) => {
  if (-128 <= value && value < 128) {
    resize(buffer, i += 2);
    data.setUint8(i - 2, types.i8);
    data.setInt8(i - 1, value);
  }
  else if (-32768 <= value && value < 32768) {
    resize(buffer, i += 3);
    data.setUint8(i - 3, types.i16);
    data.setInt16(i - 2, value, littleEndian);
  }
  else if (-2147483648 <= value && value < 2147483648) {
    resize(buffer, i += 5);
    data.setUint8(i - 5, types.i32);
    data.setInt32(i - 4, value, littleEndian);
  }
  else toFloat(buffer, value);
};

const toUint = (buffer, value) => {
  if (value < 256) {
    resize(buffer, i += 2);
    data.setUint8(i - 2, types.u8);
    data.setUint8(i - 1, value);
  }
  else if (value < 65536) {
    resize(buffer, i += 3);
    data.setUint8(i - 3, types.u16);
    data.setUint16(i - 2, value, littleEndian);
  }
  else if (value < 4294967296) {
    resize(buffer, i += 5);
    data.setUint8(i - 5, types.u32);
    data.setUint32(i - 4, value, littleEndian);
  }
  else toFloat(buffer, value);
};

const toFloat = (buffer, value) => {
  resize(buffer, i += 9);
  data.setUint8(i - 9, types.f64);
  data.setFloat64(i - 8, value, littleEndian);
};

// cache
const toCache = (buffer, cache, value) => {
  const index = cache.get(value);
  if (typeof index === 'number') {
    resize(buffer, i += 1);
    data.setUint8(i - 1, types.ref);
    toUint(buffer, index);
    return true;
  }
  cache.set(value, i);
  return false;
};

// common
const toLength = (buffer, type, length, factor) => {
  resize(buffer, i + 10 + length * factor);
  data.setUint8(i++, type);
  toUint(buffer, length);
};

// utils
const ignore = buffer => {
  resize(buffer, i += 1);
  data.setUint8(i - 1, types.ignore);
};

const one = (buffer, type) => {
  resize(buffer, i += 1);
  data.setUint8(i - 1, type);
};

const resize = (buffer, length) => {
  if (byteLength < length) {
    byteLength += length + minByteLength;
    buffer.grow(byteLength);
  }
};

let i = 0, byteLength = i, data;

const flatten = (buffer, cache, value, type = toType(value)) => {
  switch (type) {
    case 'null': {
      one(buffer, types.null);
      break;
    }
    case 'object': {
      if (toCache(buffer, cache, value)) break;
      switch (true) {
        case isArray(value): {
          const length = value.length;
          toLength(buffer, types.array, length, 1);
          for (let j = 0; j < length; j++)
            flatten(buffer, cache, value[j]);
          break;
        }
        case isView(value): {
          one(buffer, types.view);
          flatten(buffer, cache, value.constructor.name, 'string');
          toUint(buffer, value.byteOffset);
          value = value.buffer;
          if (toCache(buffer, cache, value)) break;
        }
        case value instanceof ArrayBuffer: {
          const byteLength = value.byteLength;
          const maxByteLength = value.resizable ? value.maxByteLength : 0;
          toLength(buffer, types.buffer, byteLength, 1);
          toUint(buffer, maxByteLength);
          if (byteLength) {
            resize(buffer, i += byteLength);
            new Uint8Array(buffer).set(new Uint8Array(value), i - byteLength);
          }
          break;
        }
        case value instanceof Date: {
          one(buffer, types.date);
          toUint(buffer, +value);
          break;
        }
        case value instanceof Map: {
          toLength(buffer, types.map, value.size, 1);
          for (const [k, v] of value) {
            const tk = toType(k);
            const tv = toType(v);
            if (tk && tv) {  
              flatten(buffer, cache, k, tk);
              flatten(buffer, cache, v, tv);
            }
            else ignore(buffer);
          }
          break;
        }
        case value instanceof Set: {
          toLength(buffer, types.set, value.size, 1);
          for (const v of value) {
            const t = toType(v);
            if (t) flatten(buffer, cache, v, t);
            else ignore(buffer);
          }
          break;
        }
        case value instanceof RegExp: {
          one(buffer, types.regexp);
          flatten(buffer, cache, value.source, 'string');
          flatten(buffer, cache, value.flags, 'string');
          break;
        }
        case value instanceof Error: {
          one(buffer, types.error);
          flatten(buffer, cache, value.name, 'string');
          flatten(buffer, cache, value.message, 'string');
          flatten(buffer, cache, value.stack, 'string');
          break;
        }
        default: {
          if ('toJSON' in value) {
            const other = value.toJSON();
            if (other === value) {
              one(buffer, types.object);
              toUint(buffer, 0);
              break;
            }
            value = other;
            if (toCache(buffer, cache, value)) break;
          }
          const items = entries(value);
          const length = items.length;
          toLength(buffer, types.object, length, 1);
          for (let j = 0; j < length; j++) {
            const pair = items[j];
            const t = toType(pair[1]);
            if (t) {
              flatten(buffer, cache, pair[0], 'string');
              flatten(buffer, cache, pair[1], t);
            }
            else ignore(buffer);
          }
          break;
        }
      }
      break;
    }
    case 'boolean': {
      one(buffer, value ? types.true : types.false);
      break;
    }
    case 'number': {
      if (isInteger(value)) toInt(buffer, value);
      else if (isFinite(value)) toFloat(buffer, value);
      else one(buffer, types.null);
      break;
    }
    case 'string': {
      if (toCache(buffer, cache, value)) break;
      const length = value.length;
      toLength(buffer, types.string, length, 2);
      for (let j = 0; j < length; j++) {
        data.setUint16(i, value.charCodeAt(j), littleEndian);
        i += 2;
      }
      break;
    }
    case 'bigint': {
      resize(buffer, i += 9);
      data.setUint8(i - 9, types.bigint);
      data.setBigInt64(i - 8, value, littleEndian);
      break;
    }
    case 'symbol': {
      const name = value.toString().slice(7, -1);
      if (name.startsWith('Symbol.') || Symbol.keyFor(value)) {
        one(buffer, types.symbol);
        flatten(buffer, cache, name, 'string');
      }
      break;
    }
    case '': {
      one(buffer, types.undefined);
      break;
    }
    default: {
      throw new Error(`Unsupported type: ${type}`);
    }
  }
};

export const encode = (value, buffer, byteOffset = 0) => {
  data = new DataView(buffer);
  const current = i = byteOffset;
  byteLength = buffer.byteLength;
  flatten(buffer, new Map, value);
  data = null;
  return i - current;
};

export const encoder = defaults => {
  const byteOffset = defaults?.byteOffset || 0;
  return (value, buffer) => encode(value, buffer, byteOffset);
};
