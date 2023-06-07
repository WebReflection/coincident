import * as JSON from '@ungap/structured-clone/json';
import $coincident from './index.js';

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 */
const coincident = self => $coincident(self, JSON);

coincident.transfer = $coincident.transfer;

export default coincident;
