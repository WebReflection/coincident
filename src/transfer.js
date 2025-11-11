//@ts-check

import { isArray } from 'reflected-ffi/utils';

/** @type {ArrayBuffer[]} */
const nothing = [];

/** @type {WeakSet<ArrayBuffer[]>} */
const buffers = new WeakSet;

/**
 * @param {boolean} check
 * @param {any[]} args
 * @returns
 */
export const get = (check, args) => {
  let transfer = nothing;
  if (check && isArray(args.at(-1)) && buffers.has(args.at(-1))) {
    transfer = args.pop();
    buffers.delete(transfer);
  }
  return transfer;
};

/**
 * @param  {...ArrayBuffer} args
 * @returns
 */
export const set = (...args) => {
  buffers.add(args);
  return args;
};
