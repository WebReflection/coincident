import { minByteLength } from '../utils.js';
import littleEndian from './endian.js';
import types from './types.js';
import { toConstructorName, toSymbolName, toType } from '../utils/shared.js';

const { isArray } = Array;
const { isView } = ArrayBuffer;
const { isInteger, isFinite } = Number;
const { entries } = Object;

// numbers
const toInt = (data, value) => {
  if (-128 <= value && value < 128) {
    resize(data, i + 2);
    data.setUint8(i++, types.i8);
    data.setInt8(i++, value);
  }
  else if (-32768 <= value && value < 32768) {
    resize(data, i + 3);
    data.setUint8(i++, types.i16);
    data.setInt16(i, value, littleEndian);
    i += 2;
  }
  else if (-2147483648 <= value && value < 2147483648) {
    resize(data, i + 5);
    data.setUint8(i++, types.i32);
    data.setInt32(i, value, littleEndian);
    i += 4;
  }
  else toFloat(data, value);
};

const toUint = (data, value) => {
  if (value < 256) {
    resize(data, i + 2);
    data.setUint8(i++, types.u8);
    data.setUint8(i++, value);
  }
  else if (value < 65536) {
    resize(data, i + 3);
    data.setUint8(i++, types.u16);
    data.setUint16(i, value, littleEndian);
    i += 2;
  }
  else if (value < 4294967296) {
    resize(data, i + 5);
    data.setUint8(i++, types.u32);
    data.setUint32(i, value, littleEndian);
    i += 4;
  }
  else toFloat(data, value);
};

const toFloat = (data, value) => {
  resize(data, i + 9);
  data.setUint8(i++, types.f64);
  data.setFloat64(i, value, littleEndian);
  i += 8;
};

// cache
const toCache = (data, cache, value) => {
  const index = cache.get(value);
  if (typeof index === 'number') {
    resize(data, i + 1);
    data.setUint8(i++, types.ref);
    toUint(data, index);
    return true;
  }
  cache.set(value, i);
  return false;
};

// common
const toLength = (data, type, length, factor) => {
  resize(data, i + 10 + length * factor);
  data.setUint8(i++, type);
  toUint(data, length);
};

// utils
const ignore = data => {
  resize(data, i + 1);
  data.setUint8(i++, types.ignore);
};

const one = (data, type) => {
  resize(data, i + 1);
  data.setUint8(i++, type);
};

const resize = (data, length) => {
  if (byteLength < length) {
    byteLength += length + minByteLength;
    data.buffer.grow(byteLength);
  }
};

let i = 0, byteLength = i;

const flatten = (data, cache, value, type = toType(value)) => {
  switch (type) {
    case 'null': {
      one(data, types.null);
      break;
    }
    case 'object': {
      if (toCache(data, cache, value)) break;
      switch (true) {
        case isArray(value): {
          const length = value.length;
          toLength(data, types.array, length, 1);
          for (let j = 0; j < length; j++)
            flatten(data, cache, value[j]);
          break;
        }
        case isView(value): {
          const { BYTES_PER_ELEMENT, buffer, byteOffset, length } = value;
          one(data, types.view);
          flatten(data, cache, toConstructorName(value.constructor), 'string');
          toUint(data, byteOffset);
          toUint(data, length !== ((buffer.byteLength - byteOffset) / BYTES_PER_ELEMENT) ? length : 0);
          if (toCache(data, cache, buffer)) break;
          value = buffer;
        }
        case value instanceof ArrayBuffer: {
          const byteLength = value.byteLength;
          const maxByteLength = value.resizable ? value.maxByteLength : 0;
          toLength(data, types.buffer, byteLength, 1);
          toUint(data, maxByteLength);
          if (byteLength) {
            resize(data, i += byteLength);
            const ui8a = new Uint8Array(value, 0, byteLength);
            new Uint8Array(data.buffer).set(ui8a, i - byteLength);
          }
          break;
        }
        case value instanceof Date: {
          one(data, types.date);
          toUint(data, +value);
          break;
        }
        case value instanceof Map: {
          toLength(data, types.map, value.size, 1);
          for (const [k, v] of value) {
            const tk = toType(k);
            const tv = toType(v);
            if (tk && tv) {  
              flatten(data, cache, k, tk);
              flatten(data, cache, v, tv);
            }
            else ignore(data);
          }
          break;
        }
        case value instanceof Set: {
          toLength(data, types.set, value.size, 1);
          for (const v of value) {
            const t = toType(v);
            if (t) flatten(data, cache, v, t);
            else ignore(data);
          }
          break;
        }
        case value instanceof RegExp: {
          one(data, types.regexp);
          flatten(data, cache, value.source, 'string');
          flatten(data, cache, value.flags, 'string');
          break;
        }
        case value instanceof Error: {
          one(data, types.error);
          flatten(data, cache, value.name, 'string');
          flatten(data, cache, value.message, 'string');
          flatten(data, cache, value.stack, 'string');
          break;
        }
        default: {
          if ('toJSON' in value) {
            const other = value.toJSON();
            if (other === value) {
              one(data, types.object);
              toUint(data, 0);
              break;
            }
            value = other;
            if (toCache(data, cache, value)) break;
          }
          const items = entries(value);
          const length = items.length;
          toLength(data, types.object, length, 1);
          for (let j = 0; j < length; j++) {
            const pair = items[j];
            const t = toType(pair[1]);
            if (t) {
              flatten(data, cache, pair[0], 'string');
              flatten(data, cache, pair[1], t);
            }
            else ignore(data);
          }
          break;
        }
      }
      break;
    }
    case 'boolean': {
      one(data, value ? types.true : types.false);
      break;
    }
    case 'number': {
      if (isInteger(value)) toInt(data, value);
      else if (isFinite(value)) toFloat(data, value);
      else one(data, types.null);
      break;
    }
    case 'string': {
      if (toCache(data, cache, value)) break;
      const length = value.length;
      toLength(data, types.string, length, 2);
      for (let j = 0; j < length; j++) {
        data.setUint16(i, value.charCodeAt(j), littleEndian);
        i += 2;
      }
      break;
    }
    case 'bigint': {
      resize(data, i + 9);
      data.setUint8(i++, types.b64);
      data.setBigInt64(i, value, littleEndian);
      i += 8;
      break;
    }
    case 'symbol': {
      const name = toSymbolName(value);
      if (name) {
        one(data, types.symbol);
        flatten(data, cache, name, 'string');
        break;
      }
    }
    case '': {
      one(data, types.undefined);
      break;
    }
    /* c8 ignore next */
    default: throw new Error(`Unsupported type: ${type}`);
  }
};

export const encode = (value, buffer, { byteOffset = 0 } = {}) => {
  const current = i = byteOffset;
  byteLength = buffer.byteLength;
  flatten(new DataView(buffer), new Map, value);
  return i - current;
};

export const encoder = options => (value, buffer) => encode(value, buffer, options);
