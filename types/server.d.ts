export default coincident;
export type Coincident = {
    proxy: ProxyHandler<typeof globalThis>;
    window: ProxyHandler<Window>;
    isWindowProxy: (value: any) => boolean;
};
export type CoincidentWorker = object & Coincident;
export type CoincidentServer = (wss: WebSocketServer, globals?: object) => WebSocketServer;
export type CoincidentWeb = (self: typeof globalThis | Worker, ws?: WebSocket | undefined) => Coincident | CoincidentWorker;
/** @type {CoincidentServer} */
declare function coincident(wss: WebSocketServer, globals: any): WebSocketServer;
import Worker from './shared/worker.js';
