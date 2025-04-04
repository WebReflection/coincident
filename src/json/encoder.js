import createEncoder from '../utils/encoder.js';

const { stringify } = JSON;

export const encode = value => stringify(value);

export const encoder = createEncoder(stringify);
