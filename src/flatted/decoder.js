import { toSymbolValue } from '../utils/shared.js';
import createDecoder from '../utils/decoder.js';
import types from './types.js';

const { defineProperty } = Object;

const unflatten = arr => {
  switch (arr[i++]) {
    case types.array: {
      const length = arr[i++];
      const array = [];
      arr[i - 2] = array;
      for (let j = 0; j < length; j++)
        array[j] = unflatten(arr);
      return array;
    }
    case types.object: {
      const length = arr[i++];
      const object = {};
      arr[i - 2] = object;
      for (let j = 0; j < length; j++)
        object[unflatten(arr)] = unflatten(arr);
      return object;
    }
    case types.string: {
      const string = arr[i++];
      arr[i - 2] = string;
      return string;
    }
    case types.ref: return arr[arr[i++]];
    case types.number: return arr[i++];
    case types.bigint: return BigInt(arr[i++]);
    case types.true: return true;
    case types.false: return false;
    case types.null: return null;
    case types.undefined: return void 0;
    case types.buffer: {
      const byteLength = arr[i++];
      const maxByteLength = arr[i++];
      const args = [byteLength];
      if (maxByteLength) args.push({ maxByteLength });
      const buffer = new ArrayBuffer(...args);
      arr[i - 3] = buffer;
      const ui8a = new Uint8Array(buffer, 0, byteLength);
      for (let j = 0; j < byteLength; j++) ui8a[j] = arr[i++];
      return buffer;
    }
    case types.view: {
      const name = arr[i++];
      const byteOffset = arr[i++];
      const length = arr[i++];
      const index = i - 4;
      const args = [unflatten(arr), byteOffset];
      if (length) args.push(length);
      const view = new globalThis[name](...args);
      arr[index] = view;
      return view;
    }
    case types.symbol: {
      return toSymbolValue(arr[i++]);
    }
    case types.date: {
      const date = new Date(arr[i++]);
      arr[i - 2] = date;
      return date;
    }
    case types.map: {
      const size = arr[i++];
      const map = new Map;
      arr[i - 2] = map;
      for (let j = 0; j < size; j++) {
        const key = unflatten(arr);
        const value = unflatten(arr);
        if (key !== void 0)
          map.set(key, value);
      }
      return map;
    }
    case types.set: {
      const size = arr[i++];
      const set = new Set;
      arr[i - 2] = set;
      for (let j = 0; j < size; j++) {
        const value = unflatten(arr);
        if (value !== void 0)
          set.add(value);
      }
      return set;
    }
    case types.regexp: {
      const source = arr[i++];
      const flags = arr[i++];
      const regexp = new RegExp(source, flags);
      arr[i - 3] = regexp;
      return regexp;
    }
    case types.error: {
      const Class = globalThis[arr[i++]] || Error;
      const message = arr[i++];
      const value = arr[i++];
      const cause = arr[i++];
      const error = new Class(message, { cause });
      arr[i - 5] = defineProperty(error, 'stack', { value });
      return error;
    }
    default:
      throw new TypeError(`Unknown type: ${arr[i - 1]}`);
  }
};

const { parse } = JSON;

let i = 0;

export const raw = arr => {
  i = 0;
  return arr.length ? unflatten(arr) : void 0;
};

export const decode = json => raw(parse(json));

export const decoder = createDecoder(decode);
