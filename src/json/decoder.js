import createDecoder from '../utils/decoder.js';

const { parse } = JSON;

export const decode = json => parse(json);

export const decoder = createDecoder(parse);
