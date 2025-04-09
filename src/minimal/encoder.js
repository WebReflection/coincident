
import { BIGINT } from 'js-proxy/types';

import numeric from '../window/types.js';

import { toConstructorName } from '../utils/shared.js';

const { stringify } = JSON;

export default ({ byteOffset }) => (value, buffer) => {
  let checkLength = false;
  switch (value[0]) {
    case numeric.view: {
      checkLength = true;
      const { constructor, buffer } = value[1];
      value[1] = [toConstructorName(constructor), [...new Uint8Array(buffer)]];
      break;
    }
    case numeric[BIGINT]: {
      value[1] = value[1].toString();
      break;
    }
  }

  const result = stringify(value);
  const length = result.length;
  if (checkLength && (byteOffset + length) > buffer.byteLength)
    buffer.grow(byteOffset + length);

  const ui16a = new Uint16Array(buffer, byteOffset, length);
  for (let i = 0; i < length; i++) ui16a[i] = result.charCodeAt(i);
  return length;
};
