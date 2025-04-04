import { minByteLength } from '../utils.js';

const { fromCharCode } = String;
const { min } = Math;

export default decode => ({ byteOffset }) => (length, { buffer }) => {
  const ui16a = new Uint16Array(buffer, byteOffset);
  let json = '', i = 0;
  while (i < length) {
    const next = min(i + minByteLength, length);
    json += fromCharCode.apply(null, ui16a.subarray(i, next));
    i = next;
  }
  return decode(json);
};
