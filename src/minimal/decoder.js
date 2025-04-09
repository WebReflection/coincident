import { BIGINT, UNDEFINED } from 'js-proxy/types';

import numeric from '../window/types.js';

const { parse } = JSON;

export default ({ byteOffset }) => (length, buffer) => {
  const ui16a = new Uint16Array(buffer, byteOffset, length);
  const result = parse(String.fromCharCode.apply(null, ui16a));
  switch (result[0]) {
    case numeric.view: {
      const [name, buffer] = result[1];
      const ui8a = new Uint8Array(buffer);
      result[1] = new globalThis[name](ui8a.buffer);
      break;
    }
    case numeric[UNDEFINED]: {
      result[1] = void 0;
      break;
    }
    case numeric[BIGINT]: {
      result[1] = BigInt(result[1]);
      break;
    }
  }
  return result;
};
