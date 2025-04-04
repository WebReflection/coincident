import { Decoder } from 'buffered-clone/decoder';

export const decoder = defaults => {
  const decoder = new Decoder(defaults);
  return (_, ui8a) => decoder.decode(ui8a);
};
