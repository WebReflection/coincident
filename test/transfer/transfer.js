import coincident from '../../dist/window/worker.js';
const { proxy, transfer } = await coincident();

proxy.receive = (...args) => {
  console.log(args);
  const uInt8Array = new Uint8Array(1024 * 1024 * 8).map((_, i) => i);
  console.assert(uInt8Array.byteLength === 8388608, 'expected original length');
  proxy.transfer([1, 2], {array: uInt8Array}, transfer(uInt8Array.buffer));
  console.assert(uInt8Array.byteLength === 0, 'expected transfered length');
  console.log('Worker: OK');
};
