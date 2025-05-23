import {
  ARRAY,
  BIGINT,
  BOOLEAN,
  FUNCTION,
  NULL,
  NUMBER,
  OBJECT,
  STRING,
  SYMBOL,
  UNDEFINED,
} from 'js-proxy/types';

// this literal allows mapping right away
// string types into numeric values so that
// the transported and transformed arrays
// would use less bytes to satisfy te same
// contract while exchanging information.
// basically this is an home-made ENUM like
// object literal ... that's it.
// TBD: should this be part of js-proxy? it feels
//      to me like it would rather belong in there.
export default {
  [ARRAY]: 0,
  [BIGINT]: 1,
  [BOOLEAN]: 2,
  [FUNCTION]: 3,
  [NULL]: 4,
  [NUMBER]: 5,
  [OBJECT]: 6,
  [STRING]: 7,
  [SYMBOL]: 8,
  [UNDEFINED]: 9,
  view: 10,
};
