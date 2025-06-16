import coincident from '../../dist/worker.js';
import { decoder } from '../../dist/flatted_decoder.js';

const { proxy, native } = await coincident({ decoder });

console.info('worker', { native });

proxy.roundtrip = (...args) => {
  console.log('worker', ...args);
  return args;
};

const source = {
  number: 1,
  string: '🥳',
  boolean: true,
  null: null,
  undefined: void 0,
  bigint: 9223372036854775807n,
  biguint: 9223372036854775808n,
  date: new Date,
  regexp: /ok/g,
  error: new Error('⚠️'),
  view: new Float32Array([1.1, 1.2, 1.3]),
  bigInt: new BigInt64Array([9223372036854775807n]),
  bigUint: new BigUint64Array([9223372036854775808n]),
};

console.time('roundtrip');
const [dest] = proxy.roundtrip(source);
console.timeEnd('roundtrip');

for (const key in source) {
  if (!dest.hasOwnProperty(key) && key !== 'undefined')
    throw new Error(`worker: ${key} is missing`);

  const sv = source[key];
  const dv = dest[key];
  if (typeof sv !== typeof dv)
    throw new Error(`worker: ${key} is not a ${typeof sv}`);

  if (typeof sv === 'object' && sv !== null) {
    if (sv.constructor !== dv.constructor)
      throw new Error(`worker: ${key} is not a ${sv.constructor.name}`);
    if (String(sv) !== String(dv))
      throw new Error(`worker: ${key} is not equal to ${dv}`);
  }
  else if (sv !== dv)
    throw new Error(`worker: ${key} is not equal to ${dv}`);
}

console.log(dest);
