import $coincident from './window.js';
import init from 'uhtml/init';

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * In workers, returns a `{proxy, window, isWindowProxy}` namespace to reach main globals synchronously.
 * @param {Worker | globalThis} self the context in which code should run
 */
const coincident = (self, ...args) => {
  const utilities = $coincident(self, ...args);
  if (!utilities.uhtml)
    utilities.uhtml = init(utilities.window.document);
  return utilities;
}

coincident.transfer = $coincident.transfer;

export default coincident;
