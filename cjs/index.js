'use strict';
/*! (c) Andrea Giammarchi - ISC */
const CHANNEL = '198405d2-5d0e-4d7a-bc32-c27392730449';

// just minifier friendly for Blob Workers' cases ... also safer against monkey-patched globals (don't ask me)
const {Atomics, Error, Int32Array, JSON, Map, Proxy, SharedArrayBuffer, String, Uint16Array, WeakMap} = globalThis;

const {BYTES_PER_ELEMENT: I32_BYTES} = Int32Array;
const {BYTES_PER_ELEMENT: UI16_BYTES} = Uint16Array;
const {fromCharCode} = String;

const context = new WeakMap;

let uid = 0;

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 * @param {{parse: (serialized: string) => any, stringify: (serializable: any) => string}} [JSON] an optional `JSON` like interface to `parse` or `stringify` content
 */
module.exports = (self, {parse, stringify} = JSON) => {
  if (!context.has(self)) {
    context.set(self, new Proxy(new Map, {
      get: (_, action) => (...args) => {
        // transaction id
        const id = uid++;

        // wait until result length is known
        let sb = new SharedArrayBuffer(I32_BYTES);
        let i32a = new Int32Array(sb);
        self.postMessage({[CHANNEL]: {action, args, id, sb}});
        Atomics.wait(i32a, 0);

        // commit transaction using the right buffer length
        const length = Atomics.load(i32a, 0);
        const bytes = UI16_BYTES * length;
        sb = new SharedArrayBuffer(bytes + (bytes % I32_BYTES));
        i32a = new Int32Array(sb);
        self.postMessage({[CHANNEL]: {id, sb}});
        Atomics.wait(i32a, 0);

        // retrieve serialized chars and parse
        let content = '';
        for (let ui16a = new Uint16Array(sb), i = 0; i < length; i++)
          // TODO: find out if a push + unique fromCharCode has good old limitations/issues
          //       if not, benchmark switching over single fromCharCode(...pshed) approach
          content += fromCharCode(Atomics.load(ui16a, i));
        return parse(content);
      },
      set(actions, action, callback) {
        if (!actions.size) {
          const job = new Map;
          self.addEventListener('message', async ({data}) => {
            if (data[CHANNEL]) {
              const {action, args, id, sb} = data[CHANNEL];
              const i32a = new Int32Array(sb);
              if (!action) {
                const result = job.get(id);
                job.delete(id);
                for (let ui16a = new Uint16Array(sb), i = 0; i < result.length; i++)
                  ui16a[i] = result.charCodeAt(i);
                Atomics.notify(i32a, 0);
              }
              else if (actions.has(action)) {
                const result = stringify(await actions.get(action)(...args));
                job.set(id, result);
                Atomics.store(i32a, 0, result.length);
                Atomics.notify(i32a, 0);
              }
              else
                throw new Error(`Unsupported action: ${action}`);
            }
          });
        }
        actions.set(action, callback);
        return true;
      }
    }));
  }
  return context.get(self);
};
