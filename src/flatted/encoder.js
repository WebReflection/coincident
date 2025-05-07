import createEncoder from '../utils/encoder.js';
import types from './types.js';
import { minByteLength } from '../utils.js';
import { toConstructorName, toSymbolName, toType } from '../utils/shared.js';

const { isArray } = Array;
const { isView } = ArrayBuffer;
const { stringify } = JSON;

const toCache = (arr, cache, value) => {
  const index = cache.get(value);
  if (typeof index === 'number') {
    arr.push(types.ref, index);
    return true;
  }
  cache.set(value, arr.length);
  return false;
};

const flatten = (arr, cache, value, type = toType(value)) => {
  switch (type) {
    case 'null': {
      arr.push(types.null);
      break;
    }
    case 'object': {
      if (toCache(arr, cache, value)) break;
      switch (true) {
        case isArray(value): {
          const length = value.length;
          arr.push(types.array, length);
          for (let i = 0; i < length; i++)
            flatten(arr, cache, value[i]);
          break;
        }
        case isView(value): {
          const { BYTES_PER_ELEMENT, buffer, byteOffset, length } = value;
          arr.push(
            types.view,
            toConstructorName(value.constructor),
            byteOffset,
            length !== ((buffer.byteLength - byteOffset) / BYTES_PER_ELEMENT) ? length : 0
          );
          if (toCache(arr, cache, buffer)) break;
          value = buffer;
        }
        case value instanceof ArrayBuffer: {
          const byteLength = value.byteLength;
          const maxByteLength = value.resizable ? value.maxByteLength : 0;
          arr.push(types.buffer, byteLength, maxByteLength);
          if (byteLength) {
            const ui8a = new Uint8Array(value, 0, byteLength);
            for (let i = 0; i < ui8a.length; i += minByteLength)
              arr.push.apply(arr, ui8a.subarray(i, i + minByteLength));
          }
          break;
        }
        case value instanceof Date: {
          arr.push(types.date, +value);
          break;
        }
        case value instanceof Map: {
          const length = arr.push(types.map, 0);
          let i = 0;
          for (const [k, v] of value) {
            const tk = toType(k);
            const tv = toType(v);
            if (tk && tv) {  
              flatten(arr, cache, k, tk);
              flatten(arr, cache, v, tv);
              i++;
            }
          }
          arr[length - 1] = i;
          break;
        }
        case value instanceof Set: {
          const length = arr.push(types.set, 0);
          let i = 0;
          for (const v of value) {
            const t = toType(v);
            if (t) {
              flatten(arr, cache, v, t);
              i++;
            }
          }
          arr[length - 1] = i;
          break;
        }
        case value instanceof RegExp: {
          arr.push(types.regexp, value.source, value.flags);
          break;
        }
        case value instanceof Error: {
          arr.push(types.error, value.name, value.message, value.stack, value.cause);
          break;
        }
        default: {
          if ('toJSON' in value) {
            const other = value.toJSON();
            if (other === value) {
              arr.push(types.object, 0);
              break;
            }
            value = other;
            if (toCache(arr, cache, value)) break;
          }
          const length = arr.push(types.object, 0);
          let i = 0;
          for (const k in value) {
            const v = value[k];
            const t = toType(v);
            if (t) {
              flatten(arr, cache, k, 'string');
              flatten(arr, cache, v, t);
              i++;
            }
          }
          arr[length - 1] = i;
          break;
        }
      }
      break;
    }
    case 'boolean': {
      arr.push(value ? types.true : types.false);
      break;
    }
    case 'string': {
      if (toCache(arr, cache, value)) break;
      arr.push(types.string, value);
      break;
    }
    case 'bigint': {
      arr.push(types.bigint, value.toString());
      break;
    }
    case 'symbol': {
      const name = toSymbolName(value);
      if (name) {
        arr.push(types.symbol, name);
        break;
      }
    }
    case '': {
      arr.push(types.undefined);
      break;
    }
    default: {
      arr.push(types[type], value);
      break;
    }
  }
};

export const raw = value => {
  const arr = [];
  flatten(arr, new Map, value);
  return arr;
};

export const encode = value => stringify(raw(value));

export const encoder = createEncoder(encode);
