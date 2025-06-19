import { decode as directDecode } from 'reflected-ffi/decoder';
import { encoder as directEncoder } from 'reflected-ffi/encoder';
import { Array, Buffer } from 'reflected-ffi/buffer';

const buffer = new Array;
const encoder = directEncoder({ Array: Buffer });

export const encode = value => {
  const length = encoder(value, buffer);
  return length ? buffer.value : buffer;
};

export const decode = buffer => directDecode(new Uint8Array(buffer));
