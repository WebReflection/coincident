import { stringify } from '@ungap/structured-clone/json';

import createEncoder from '../utils/encoder.js';

export const encode = value => stringify(value);

export const encoder = createEncoder(stringify);
