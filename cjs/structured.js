'use strict';
const JSON = require('@ungap/structured-clone/json');
const $coincident = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('./index.js'));

/**
 * Create once a `Proxy` able to orchestrate synchronous `postMessage` out of the box.
 * @param {globalThis | Worker} self the context in which code should run
 */
const coincident = self => $coincident(self, JSON);

coincident.transfer = $coincident.transfer;

module.exports = coincident;
