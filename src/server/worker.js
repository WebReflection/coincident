import { MAIN_WS, WORKER_WS } from './constants.js';

import remote from 'reflected-ffi/remote';

import coincident from '../window/worker.js';

export default async options => {
  const exports = await coincident(options);

  const ffi = remote({
    ...options,
    buffer: true,
    timeout: exports.ffi_timeout,
    reflect: exports.proxy[MAIN_WS],
  });

  exports.proxy[WORKER_WS] = ffi.reflect;

  const server = {};
  for (const key in exports.ffi) server[key] = ffi[key];

  return {
    ...exports,
    server: ffi.global,
    isServerProxy: ffi.isProxy,
    ffi: {
      ...exports.ffi,
      window: exports.ffi,
      server,
    }
  };
};
