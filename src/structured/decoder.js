import { parse } from '@ungap/structured-clone/json';

import createDecoder from '../utils/decoder.js';

export const decode = json => parse(json);

export const decoder = createDecoder(parse);
