/*! (c) Andrea Giammarchi - ISC */
const CHANNEL = '854ac5c3-44f1-4b2e-8d34-902cf30ef895';

const {BYTES_PER_ELEMENT} = Int32Array;
const {ceil} = Math;
const {fromCharCode} = String;

const context = new WeakMap;

let uid = 0;

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis} self the context in which code should run
 * @param {{parse: (serialized: string) => any, stringify: (serializable: any) => string}} [JSON] an optional `JSON` like interface to `parse` or `stringify` content
 */
export default (self, {parse, stringify} = JSON) => {
  if (!context.has(self)) {
    context.set(self, new Proxy(new Map, {
      get: (_, action) => (...args) => {
        // transaction id
        const id = uid++;

        // wait until result length is known
        let sb = new SharedArrayBuffer(BYTES_PER_ELEMENT);
        let i32a = new Int32Array(sb);
        self.postMessage({[CHANNEL]: {action, args, id, sb}});
        Atomics.wait(i32a, 0);

        // commit transaction using the right buffer length
        const length32 = Atomics.load(i32a, 0);
        const length16 = ceil(length32 / 2);
        sb = new SharedArrayBuffer(length16 * BYTES_PER_ELEMENT);
        i32a = new Int32Array(sb);
        self.postMessage({[CHANNEL]: {args: [length16], id, sb}});
        Atomics.wait(i32a, 0);

        // retrieve serialized chars and parse
        let content = '';
        for (let i = 0; i < length16;) {
          const c = Atomics.load(i32a, i++);
          const a = c >> 16;
          const b = c & 0xFFFF;
          // TODO: find out if a push + unique fromCharCode has good old limitations/issues
          content += (i * 2) > length32 ? fromCharCode(a) : fromCharCode(a, b);
        }
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
                const {length} = result;
                job.delete(id);
                for (let i = 0, j = 0; i < args[0]; i++) {
                  const a = result.charCodeAt(j++) << 16;
                  const b = j === length ? 0 : result.charCodeAt(j++);
                  Atomics.store(i32a, i, a + b);
                }
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
