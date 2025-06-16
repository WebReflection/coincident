import { decode as directDecode } from 'reflected-ffi/decoder';
import { encode as directEncode } from 'reflected-ffi/encoder';

export const encode = value => new Uint8Array(directEncode(value)).buffer;
export const decode = buffer => directDecode(new Uint8Array(buffer));
