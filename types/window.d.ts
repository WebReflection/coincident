export default coincident;
export type Coincident = {
    proxy: ProxyHandler<typeof globalThis>;
    window: ProxyHandler<Window>;
    isWindowProxy: (value: any) => boolean;
};
/**
 * @typedef {object} Coincident
 * @property {ProxyHandler<globalThis>} proxy
 * @property {ProxyHandler<Window>} window
 * @property {(value: any) => boolean} isWindowProxy
 */
/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * In workers, returns a `{proxy, window, isWindowProxy}` namespace to reach main globals synchronously.
 * @param {Worker | globalThis} self the context in which code should run
 * @returns {ProxyHandler<Worker> | Coincident}
 */
declare function coincident(self: Worker | typeof globalThis, ...args: any[]): ProxyHandler<Worker> | Coincident;
declare namespace coincident {
    let transfer: (...args: any[]) => any[];
}
import Worker from './shared/worker.js';
