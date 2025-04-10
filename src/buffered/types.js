// range of types from 0 to 256 (excluded)
export default {
  ref: 0,
  // primitives
  false: 1,
  true: 2,
  null: 3,
  undefined: 4,
  string: 5,
  array: 10,
  object: 20,
  // binary
  buffer: 30,
  view: 40,
  // number
  i8: 50,
  u8: 51,
  i16: 52,
  u16: 53,
  i32: 54,
  u32: 55,
  f64: 64,
  b64: 70,
  // aggregated (type + variant of previous types)
  date: 100,    // type + timestamp
  map: 101,     // type + arrayX of key-value pairs
  set: 102,     // type + arrayX of values
  symbol: 103,  // type + stringX name
  regexp: 104,  // type + stringX source and stringX flags
  error: 105,   // type + stringX name + stringX message + stringX cause + stringX stack

  ignore: 255   // used to ignore values
};
