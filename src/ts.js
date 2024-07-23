// this file exists only to please JSDoc TS

/** @typedef {Record<string, function>} Proxy */

export class CoincidentWorker extends Worker {
  constructor(url, options) {
    super(url, { ...options, type: 'module' });
    /** @type {Proxy} */
    this.proxy = {};
  }
}
