import coincident from '../dist/window.js';

const {proxy} = coincident(self);

proxy.getValue = () => Math.random();
