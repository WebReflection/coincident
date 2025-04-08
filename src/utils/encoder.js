export default encode => ({ byteOffset = 0 } = {}) => (value, buffer) => {
  const string = encode(value);
  const length = string.length;
  const size = length * 2 + byteOffset;
  if (buffer.byteLength < size) buffer.grow(size);
  const ui16a = new Uint16Array(buffer, byteOffset, length);
  for (let i = 0; i < length; i++)
    ui16a[i] = string.charCodeAt(i);
  return length;
};
