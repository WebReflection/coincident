export default coincident;
/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 * @returns {ProxyHandler<globalThis> | ProxyHandler<Worker>}
 */
declare function coincident(self: typeof globalThis | Worker, options: any): ProxyHandler<typeof globalThis> | ProxyHandler<Worker>;
declare namespace coincident {
    let transfer: (...args: any[]) => any[];
}
