import coincident from '../../dist/window/worker.js';
const { proxy } = await coincident();

proxy.worker = () => '🔥 this is fine 🔥';

// here the 💀🔒
proxy.main();
