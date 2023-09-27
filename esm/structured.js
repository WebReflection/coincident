import JSON from './json.js';
import $coincident from './index.js';

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 * @returns {ProxyHandler<globalThis> | ProxyHandler<Worker>}
 */
const coincident = (self, options) => $coincident(self, {...JSON, ...options});

coincident.transfer = $coincident.transfer;

export default coincident;
