import coincident from '../es.js';

const until = coincident(self);
const {transfer} = coincident;

const uInt8Array = new Uint8Array(1024 * 1024 * 8).map((v, i) => i);
console.assert(uInt8Array.byteLength === 8388608, 'expected original length');
until.transfer({array: uInt8Array}, transfer(uInt8Array.buffer));
console.assert(uInt8Array.byteLength === 0, 'expected transfered length');
console.log('OK');
