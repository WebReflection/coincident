export default buffer => ({
  value: new Promise(onmessage => {
    let w = new Worker('data:application/javascript,' + encodeURIComponent(
      'onmessage=({data:b})=>(Atomics.wait(b,0),postMessage("ok"))'
    ));
    w.onmessage = onmessage;
    w.postMessage(buffer);
  })
});
