// The goal of this file is to normalize SAB
// at least in main -> worker() use cases.
// This still cannot possibly solve the sync
// worker -> main() use case if SharedArrayBuffer
// is not available or usable.

import {CHANNEL} from './channel.js';

const {isArray} = Array;

let {SharedArrayBuffer, window} = globalThis;
let {notify, wait, waitAsync} = Atomics;
let postPatched = null;

// This is needed for some version of Firefox
if (!waitAsync) {
  waitAsync = buffer => ({
    value: new Promise(onmessage => {
      // encodeURIComponent('onmessage=({data:b})=>(Atomics.wait(b,0),postMessage(0))')
      let w = new Worker('data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))');
      w.onmessage = onmessage;
      w.postMessage(buffer);
    })
  });
}

// Monkey-patch SharedArrayBuffer if needed
try {
  new SharedArrayBuffer(4);
}
catch (_) {
  SharedArrayBuffer = ArrayBuffer;

  const ids = new WeakMap;
  // patch only main -> worker():async use case
  if (window) {
    const resolvers = new Map;
    const {prototype: {postMessage}} = Worker;

    const listener = event => {
      const details = event.data?.[CHANNEL];
      if (!isArray(details)) {
        event.stopImmediatePropagation();
        const { id, sb } = details;
        resolvers.get(id)(sb);
      }
    };

    postPatched = function (data, ...rest) {
      const details = data?.[CHANNEL];
      if (isArray(details)) {
        const [id, sb] = details;
        ids.set(sb, id);
        this.addEventListener('message', listener);
      }
      return postMessage.call(this, data, ...rest);
    };

    waitAsync = sb => ({
      value: new Promise(resolve => {
        resolvers.set(ids.get(sb), resolve);
      }).then(buff => {
        resolvers.delete(ids.get(sb));
        ids.delete(sb);
        for (let i = 0; i < buff.length; i++) sb[i] = buff[i];
        return 'ok';
      })
    });
  }
  else {
    const as = (id, sb) => ({[CHANNEL]: { id, sb }});

    notify = sb => {
      postMessage(as(ids.get(sb), sb));
    };

    addEventListener('message', event => {
      const details = event.data?.[CHANNEL];
      if (isArray(details)) {
        const [id, sb] = details;
        ids.set(sb, id);
      }
    });
  }
}

export {SharedArrayBuffer, isArray, notify, postPatched, wait, waitAsync};
