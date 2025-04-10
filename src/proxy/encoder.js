import { BIGINT } from 'js-proxy/types';

import { toConstructorName } from '../utils/shared.js';
import createEncoder from '../utils/encoder.js';
import numeric from '../window/types.js';

const { stringify } = JSON;

export const encode = value => {
  switch (value[0]) {
    case numeric.view: {
      const { constructor, buffer } = value[1];
      value[1] = [toConstructorName(constructor), [...new Uint8Array(buffer)]];
      break;
    }
    case numeric[BIGINT]: {
      value[1] = value[1].toString();
      break;
    }
  }
  return stringify(value);
};

export const encoder = createEncoder(encode);
