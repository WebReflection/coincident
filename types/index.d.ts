export default coincident;
/**
 * used to sanity-check interrupts while waiting synchronously.
 */
export type Interrupt = {
    /**
     * a callback invoked every `delay` milliseconds.
     */
    handler?: Function | undefined;
    /**
     * define `handler` invokes in terms of milliseconds.
     */
    delay?: number | undefined;
};
/**
 * @typedef {Object} Interrupt used to sanity-check interrupts while waiting synchronously.
 * @prop {function} [handler] a callback invoked every `delay` milliseconds.
 * @prop {number} [delay=42] define `handler` invokes in terms of milliseconds.
 */
/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 * @param {{parse: (serialized: string) => any, stringify: (serializable: any) => string, transform?: (value:any) => any, interrupt?: () => void | Interrupt}} [JSON] an optional `JSON` like interface to `parse` or `stringify` content with extra `transform` ability.
 * @returns {ProxyHandler<globalThis> | ProxyHandler<Worker>}
 */
declare function coincident(self: typeof globalThis | Worker, { parse, stringify, transform, interrupt }?: {
    parse: (serialized: string) => any;
    stringify: (serializable: any) => string;
    transform?: ((value: any) => any) | undefined;
    interrupt?: (() => void | Interrupt) | undefined;
} | undefined): ProxyHandler<typeof globalThis> | ProxyHandler<Worker>;
declare namespace coincident {
    function transfer(...args: any[]): any[];
}
