import coincident from '../../window.js';

const {proxy, window, isWindowProxy} = coincident(self);

window.dispatchEvent(new window.Event('ready'));

proxy.greetings(isWindowProxy(window.document.body));

window.document.documentElement.classList.add('ready');
