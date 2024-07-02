// The goal of this file is to normalize SAB
// at least in main -> worker() use cases.
// This still cannot possibly solve the sync
// worker -> main() use case if SharedArrayBuffer
// is not available or usable.

const {isArray} = Array;

import * as main from 'sabayon/main';
import * as worker from 'sabayon/worker';

const {
  Atomics,
  Int32Array,
  SharedArrayBuffer,
  Worker,
  addEventListener,
  postMessage,
  ignore,
} = globalThis.window ? main : worker;

const {
  notify,
  wait,
  waitAsync,
} = Atomics;

export {
  Int32Array,
  SharedArrayBuffer,
  Worker,
  addEventListener,
  postMessage,
  ignore,
  isArray,
  notify,
  wait,
  waitAsync
};
