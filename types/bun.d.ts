declare function _default(globals: object): {
    /**
     * @param {WebSocket} ws
     * @param {string} message
     */
    message(ws: WebSocket, message: string): void;
    /**
     * @param {WebSocket} ws
     */
    open(ws: WebSocket): void;
    /**
     * @param {WebSocket} ws
     */
    close(ws: WebSocket): void;
};
export default _default;
