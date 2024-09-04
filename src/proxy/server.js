import { APPLY } from 'js-proxy/traps';

import {
  isChannel,
  withResolvers,
} from 'sabayon/shared';

import mainProxy from './main.js';

const { parse: p, stringify: s } = JSON;

const event = {
  data: null,
  stopImmediatePropagation() {},
  preventDefault() {},
};

export default (ws, options) => {
  const { parse = p, stringify = s } = options;
  const resolvers = new Map;
  let init = true, id = 0, CHANNEL = '', __main__;
  return {
    onclose: () => {
      for (const [_, resolve] of resolvers) resolve();
      resolvers.clear();
      CHANNEL = '';
      __main__ = null;
    },
    onmessage: async (buffer) => {
      try {
        const data = parse(String(buffer));
        event.data = data;
        if (isChannel(event, CHANNEL)) {
          if (init) {
            init = false;
            [CHANNEL] = data;
            __main__ = mainProxy((TRAP, ref, ...args) => {
              let promise, resolve;
              if (TRAP === APPLY) {
                ({ promise, resolve } = withResolvers());
                resolvers.set(id, resolve);
                args.unshift(id++);
              }
              ws.send(stringify([CHANNEL, null, [TRAP, ref, ...args]]));
              return promise;
            });
            ws.send('');
          }
          else {
            const [_, id, TRAP, ref, ...args] = data;
            if (id == null) {
              resolvers.get(ref)(...args);
              resolvers.delete(ref);
            }
            else {
              let result;
              try {
                result = await __main__(TRAP, ref, ...args);
              }
              catch (_) {}
              ws.send(stringify([CHANNEL, id, result]));
            }
          }
        }
      }
      catch(_) {}
    }
  };
};
