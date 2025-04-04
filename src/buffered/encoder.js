import { Encoder } from 'buffered-clone/encoder';

export const encoder = defaults => {
  const encoder = new Encoder(defaults);
  return (value, { buffer }) => encoder.encode(value, buffer);
};
