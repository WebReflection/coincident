import coincident from '../../dist/worker.js';
const { proxy } = await coincident();

proxy.worker = () => '🔥 this is fine 🔥';

// here the 💀🔒
proxy.main();
