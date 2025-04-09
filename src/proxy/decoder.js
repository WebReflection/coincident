import { BIGINT, UNDEFINED } from 'js-proxy/types';
import createDecoder from '../utils/decoder.js';
import numeric from '../window/types.js';

const { parse } = JSON;

export const decode = json => {
  const result = parse(json);
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

export const decoder = createDecoder(decode);
