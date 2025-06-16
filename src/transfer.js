//@ts-check

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
  if (check && buffers.has(args.at(-1) || nothing)) {
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
