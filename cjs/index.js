'use strict';
/*! (c) Andrea Giammarchi - ISC */
const CHANNEL = 'abd83994-8b06-4e38-8fd6-e7ff4490adca';

// just minifier friendly for Blob Workers' cases
const {Atomics, Int32Array, Map, SharedArrayBuffer, Uint16Array} = globalThis;

// common constants / utilities for repeated operations
const {BYTES_PER_ELEMENT: I32_BYTES} = Int32Array;
const {BYTES_PER_ELEMENT: UI16_BYTES} = Uint16Array;
const {fromCharCode} = String;

// retain either main threads or workers global context
const context = new WeakMap;

// used to generate a unique `id` per each worker `postMessage` "transaction"
let uid = 0;

// used to transfer buffers instead of copying these
let list = [];

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 * @param {{parse: (serialized: string) => any, stringify: (serializable: any) => string}} [JSON] an optional `JSON` like interface to `parse` or `stringify` content
 */
const coincident = (self, {parse, stringify} = JSON) => {
  if (!context.has(self)) {

    // ensure the CHANNEL and data are posted correctly
    const post = (id, sb, action, args) => self.postMessage(
      {[CHANNEL]: {id, sb, action, args}},
      {transfer: list.splice(0)}
    );

    context.set(self, new Proxy(new Map, {
      // worker related: get any utility that should be available on the main thread
      get: (_, action) => (...args) => {
        // transaction id
        const id = uid++;

        // wait until result length is known (use just i32 for simplicity)
        let sb = new SharedArrayBuffer(I32_BYTES);
        let i32a = new Int32Array(sb);

        // if a transfer list has been passed, drop it from args
        if (args.at(-1) === list) args.pop();

        post(id, sb, action, args);
        Atomics.wait(i32a, 0);

        // commit transaction using the right buffer length
        const length = Atomics.load(i32a, 0);
        // calculate the needed ui16 bytes length to store the result string
        const bytes = UI16_BYTES * length;
        // round up to the next amount of bytes divided by 4 to allow i32 operations
        sb = new SharedArrayBuffer(bytes + (bytes % I32_BYTES));
        // use an i32 view to wait for results
        i32a = new Int32Array(sb);
        // ask for results ...
        post(id, sb);
        // ... and wait for it
        Atomics.wait(i32a, 0);

        // retrieve serialized chars and parse via known length and an ui16 view
        let content = '';
        for (let ui16a = new Uint16Array(sb), i = 0; i < length; i++)
          // TODO: find out if a push + unique fromCharCode has good old limitations/issues
          //       if not, benchmark switching over single fromCharCode(...pushed) approach
          content += fromCharCode(Atomics.load(ui16a, i));
        // return deserialized content after previous dance to recreate it
        return parse(content);
      },
      // main thread related: react to any utility a worker is asking for
      set(actions, action, callback) {
        // lazy event listener and logic handling, triggered once by setters actions
        if (!actions.size) {
          // maps jobs by `id` as they are asked for
          const job = new Map;
          // add the event listener once (first defined setter, all others work the same)
          self.addEventListener('message', async ({data}) => {
            // check against the very same library as CHANNEL, ignore otherwise
            if (data?.[CHANNEL]) {
              const {action, args, id, sb} = data[CHANNEL];
              // shared i32 array to unlock any worker waiting for results
              const i32a = new Int32Array(sb);
              // no action/args means: get results out of the well known `id`
              if (!action) {
                const result = job.get(id);
                job.delete(id);
                // populate the SaredArrayBuffer with utf-16 chars code
                for (let ui16a = new Uint16Array(sb), i = 0; i < result.length; i++)
                  ui16a[i] = result.charCodeAt(i);
                // release the worker's lock
                Atomics.notify(i32a, 0);
              }
              // action available and it must be defined/known on the main thread
              else if (actions.has(action)) {
                // await for result either sync or async and serialize it
                const result = stringify(await actions.get(action)(...args));
                // store the result for "the very next" event listener call
                job.set(id, result);
                // communicate the required SharedArrayBuffer length out of the
                // resulting serialized string
                Atomics.store(i32a, 0, result.length);
                // release te worker waiting to dispatch the next event
                Atomics.notify(i32a, 0);
              }
              // unknown action should be notified as missing on the main thread
              else
                throw new Error(`Unsupported action: ${action}`);
            }
          });
        }
        // store this action callback allowing the setter in the process
        return !!actions.set(action, callback);
      }
    }));
  }
  return context.get(self);
};

coincident.transfer = (...args) => { list = args };

module.exports = coincident;
