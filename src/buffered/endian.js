export default new DataView(new Uint16Array([256]).buffer).getUint16(0, true) === 256;
