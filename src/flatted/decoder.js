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
      const length = arr[i++];
      const maxByteLength = arr[i++];
      const args = [length];
      if (maxByteLength) args.push({ maxByteLength });
      const buffer = new ArrayBuffer(...args);
      arr[i - 3] = buffer;
      const ui8a = new Uint8Array(buffer);
      for (let j = 0; j < length; j++) ui8a[j] = arr[i++];
      return buffer;
    }
    case types.view: {
      const name = arr[i++];
      const byteOffset = arr[i++];
      const view = new globalThis[name](unflatten(arr), byteOffset);
      arr[i - 3] = view;
      return view;
    }
    case types.symbol: {
      const name = arr[i++];
      return name.startsWith('Symbol.') ? Symbol[name.split('.')[1]] : Symbol.for(name);
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
      throw new Error(`Unknown type: ${arr[i - 1]}`);
  }
};

const { parse } = JSON;

let i = 0;

export const decode = json => {
  i = 0;
  const arr = parse(json);
  return arr.length ? unflatten(arr) : void 0;
};

export const decoder = createDecoder(decode);
