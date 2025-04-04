import { Decoder } from 'buffered-clone/decoder';
import { Encoder } from 'buffered-clone/encoder';

import { defaults } from '../utils.js';

const decoder = new Decoder(defaults);
const encoder = new Encoder(defaults);

const decode = buffer => decoder.decode(buffer);
const encode = value => encoder.encode(value);

export { decode, encode };
