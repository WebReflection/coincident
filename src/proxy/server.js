import { APPLY } from 'js-proxy/traps';

import DEBUG from '../debug.js';

import {
  isChannel,
  withResolvers,
} from 'sabayon/shared';

import mainProxy from './main.js';

const $ = String;
const { parse: p, stringify: s } = JSON;

const initValues = () => ['', true, 0, null];

const event = {
  data: null,
  stopImmediatePropagation() {},
  preventDefault() {},
};

export default (ws, options) => {
  const { parse = p, stringify = s } = options;
  const resolvers = new Map;
  let [CHANNEL, init, id, __main__] = initValues();
  return {
    onclose: () => {
      for (const [_, resolve] of resolvers) resolve();
      resolvers.clear();
      [CHANNEL, init, id, __main__] = initValues();
    },
    onmessage: async (buffer) => {
      try {
        const data = parse($(buffer));
        event.data = data;
        if (isChannel(event, CHANNEL)) {
          if (init) {
            init = false;
            [CHANNEL] = data;
            __main__ = mainProxy(
              // options.import = name => valid(name) && name
              options?.import || $,
              (TRAP, ref, ...args) => {
                let promise, resolve;
                if (TRAP === APPLY) {
                  ({ promise, resolve } = withResolvers());
                  resolvers.set(id, resolve);
                  args.push(id++);
                }
                ws.send(stringify([CHANNEL, null, [TRAP, ref, ...args]]));
                return promise;
              }
            );
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
                if (DEBUG) console.log('awaiting', TRAP, ref, ...args);
                result = await __main__(TRAP, ref, ...args);
                if (DEBUG) console.log('returned', result);
              }
              catch (_) {
                result = _;
              }
              ws.send(stringify([CHANNEL, id, result]));
            }
          }
        }
      }
      catch(_) {}
    }
  };
};
