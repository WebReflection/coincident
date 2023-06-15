/*! (c) Andrea Giammarchi - ISC */
const CHANNEL = 'eef159e0-b39b-4e0e-b711-43432daf4928';

import waitAsyncFallback from './fallback.js';

// just minifier friendly for Blob Workers' cases
const {Int32Array, Map, SharedArrayBuffer, Uint16Array} = globalThis;

// common constants / utilities for repeated operations
const {BYTES_PER_ELEMENT: I32_BYTES} = Int32Array;
const {BYTES_PER_ELEMENT: UI16_BYTES} = Uint16Array;

const {isArray} = Array;
const {notify, wait, waitAsync} = Atomics;
const {fromCharCode} = String;

// automatically uses sync wait (worker -> main)
// or fallback to async wait (main -> worker)
const waitFor = (isAsync, buffer) => isAsync ?
                  (waitAsync || waitAsyncFallback)(buffer, 0) :
                  (wait(buffer, 0), {value: {then: fn => fn()}});

// retain buffers to transfer
const buffers = new WeakSet;

// retain either main threads or workers global context
const context = new WeakMap;

// used to generate a unique `id` per each worker `postMessage` "transaction"
let uid = 0;

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 * @param {{parse: (serialized: string) => any, stringify: (serializable: any) => string}} [JSON] an optional `JSON` like interface to `parse` or `stringify` content
 */
const coincident = (self, {parse, stringify} = JSON) => {
  // create a Proxy once for the given context (globalThis or Worker instance)
  if (!context.has(self)) {
    // ensure the CHANNEL and data are posted correctly
    const post = (transfer, ...args) => self.postMessage({[CHANNEL]: args}, {transfer});

    context.set(self, new Proxy(new Map, {
      // worker related: get any utility that should be available on the main thread
      get: (_, action) => action === 'then' ? null : ((...args) => {
        // transaction id
        const id = uid++;

        // first contact: just ask for how big the buffer should be
        let sb = new SharedArrayBuffer(I32_BYTES);
        const i32a = new Int32Array(sb);

        // if a transfer list has been passed, drop it from args
        let transfer = [];
        if (buffers.has(args.at(-1) || transfer))
          buffers.delete(transfer = args.pop());

        // ask for invoke with arguments and wait for it
        post(transfer, id, sb, action, args);

        // helps deciding how to wait for results
        const isAsync = self instanceof Worker;
        return waitFor(isAsync, i32a).value.then(() => {
          // commit transaction using the returned / needed buffer length
          const length = i32a[0];

          // filter undefined results
          if (!length) return;

          // calculate the needed ui16 bytes length to store the result string
          const bytes = UI16_BYTES * length;

          // round up to the next amount of bytes divided by 4 to allow i32 operations
          sb = new SharedArrayBuffer(bytes + (bytes % I32_BYTES));

          // ask for results and wait for it
          post([], id, sb);
          return waitFor(isAsync, new Int32Array(sb)).value.then(
            // transform the shared buffer into a string and return it parsed
            () => parse(fromCharCode(...new Uint16Array(sb).slice(0, length)))
          );
        });
      }),

      // main thread related: react to any utility a worker is asking for
      set(actions, action, callback) {
        // lazy event listener and logic handling, triggered once by setters actions
        if (!actions.size) {
          // maps results by `id` as they are asked for
          const results = new Map;
          // add the event listener once (first defined setter, all others work the same)
          self.addEventListener('message', async ({data}) => {
            // grub the very same library CHANNEL; ignore otherwise
            const details = data?.[CHANNEL];
            if (isArray(details)) {
              const [id, sb, ...rest] = details;
              // shared i32 array to unlock any worker waiting for results
              const i32a = new Int32Array(sb);
              // action available: it must be defined/known on the main thread
              if (rest.length) {
                const [action, args] = rest;
                if (actions.has(action)) {
                  // await for result either sync or async and serialize it
                  const result = stringify(await actions.get(action)(...args));
                  if (result) {
                    // store the result for "the very next" event listener call
                    results.set(id, result);
                    // communicate the required SharedArrayBuffer length out of the
                    // resulting serialized string
                    i32a[0] = result.length;
                  }
                }
                // unknown action should be notified as missing on the main thread
                else {
                  throw new Error(`Unsupported action: ${action}`);
                }
              }
              // no action means: get results out of the well known `id`
              else {
                const result = results.get(id);
                results.delete(id);
                // populate the SaredArrayBuffer with utf-16 chars code
                for (let ui16a = new Uint16Array(sb), i = 0; i < result.length; i++)
                  ui16a[i] = result.charCodeAt(i);
              }
              // release te worker waiting either the length or the result
              notify(i32a, 0);
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

coincident.transfer = (...args) => (buffers.add(args), args);

export default coincident;
