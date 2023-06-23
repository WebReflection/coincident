import coincident from '../window.js';

const {window} = coincident(self);

console.log(Array.isArray(new window.Number(0)));
