// this file exists only to please JSDoc TS

/** @typedef {Record<string, function>} Proxy */

export class CoincidentWorker extends Worker {
  /** @type {Proxy} */
  proxy = {};
}

export class CoincidentWindowWorker extends CoincidentWorker {
  /** @type {<T>(value: T) => T} */
  direct = value => value;
}
