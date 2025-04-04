import { minByteLength } from '../utils.js';

export default encode => ({ byteOffset }) => (value, { buffer }) => {
  const string = encode(value);
  const length = string.length;
  if (buffer.byteLength < (length * 2 + byteOffset))
    buffer.grow(length * 2 + minByteLength);
  const ui16a = new Uint16Array(buffer, byteOffset);
  for (let i = 0; i < length; i++)
    ui16a[i] = string.charCodeAt(i);
  return length;
};
