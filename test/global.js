import coincident from './dist/window.js';

const { window } = coincident(self);

console.assert(self === window.global.call(self, window), 'self should be globalThis');
