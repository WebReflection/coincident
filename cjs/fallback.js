'use strict';
module.exports = buffer => ({
  value: new Promise(onmessage => {
    let w = new Worker('data:application/javascript,' + encodeURIComponent(
      'onmessage=({data:b})=>(Atomics.wait(b,0),postMessage(0))'
    ));
    w.onmessage = onmessage;
    w.postMessage(buffer);
  })
});
