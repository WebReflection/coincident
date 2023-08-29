import coincident from '../window.js';

const { proxy } = coincident(self);

proxy.worker = () => '🔥 this is fine 🔥';

// here the 💀🔒
proxy.main();
