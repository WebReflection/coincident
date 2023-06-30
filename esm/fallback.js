// encodeURIComponent('onmessage=({data:b})=>(Atomics.wait(b,0),postMessage(0))')

export default buffer => ({
  value: new Promise(onmessage => {
    let w = new Worker('data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))');
    w.onmessage = onmessage;
    w.postMessage(buffer);
  })
});
