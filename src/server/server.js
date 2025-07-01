import nextResolver from 'next-resolver';

import local from 'reflected-ffi/local';
import { isArray } from 'reflected-ffi/utils';

import { MAIN_WS } from './constants.js';
import { decode, encode } from './direct.js';
import { ffi_timeout } from '../utils.js';

const { String } = globalThis;

export default (ws, options) => {
  const [ next, resolve ] = nextResolver(String);
  const module = options?.import || (name => import(name));
  const resolvers = new Set;
  let move = value => value, coincident = -1, main, end;
  return {
    direct: value => move(value),
    onclose: () => {
      for (const resolve of resolvers) resolve();
      resolvers.clear();
      coincident = 0;
      end?.();
    },
    onmessage: async (buffer) => {
      if (coincident < 0) {
        coincident = 0;
        try {
          const data = decode(buffer);
          if (isArray(data) && data.at(0) === MAIN_WS) {
            coincident = 1;
            const { direct, reflect, terminate } = local({
              ...options,
              module,
              buffer: true,
              timeout: ffi_timeout(options),
              reflect(...args) {
                const [uid, promise] = next();
                ws.send(encode([uid, args]));
                resolvers.add(resolve.bind(null, uid));
                return promise;
              },
            });
            main = reflect;
            move = direct;
            end = terminate;
          }
        }
        catch(_) {}
      }
      else if (coincident > 0) {
        const data = decode(buffer);
        if (typeof data[0] === 'string')
          resolve.apply(null, data);
        else {
          try {
            data[1] = await main(...data[1]);
          }
          catch(error) {
            data[1] = null;
            data[2] = error;
          }
          ws.send(encode(data));
        }
      }
    }
  };
};
