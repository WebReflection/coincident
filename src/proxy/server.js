// import nextResolver from 'next-resolver';

// import { MAIN_WS } from '../server/constants.js';

// import { decode, encode } from '../flatted/index.js';

// import mainProxy from './main.js';

const { String } = globalThis;
const { isArray } = Array;

export default (ws, options) => {
  const [ next, resolve ] = nextResolver(String);
  const esm = options?.import || String;
  const resolvers = new Set;
  let coincident = -1, main;
  return {
    onclose: () => {
      for (const resolve of resolvers) resolve();
      resolvers.clear();
      coincident = 0;
    },
    onmessage: async (buffer) => {
      if (coincident < 0) {
        coincident = 0;
        try {
          const data = decode(String(buffer));
          if (isArray(data) && data.at(0) === MAIN_WS) {
            coincident = 1;
            main = mainProxy(esm, (...args) => {
              const [uid, promise] = next();
              ws.send(encode([uid, args]));
              resolvers.add(resolve.bind(null, uid));
              return promise;
            });
          }
        }
        catch(_) {}
      }
      else if (coincident > 0) {
        const data = decode(String(buffer));
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
