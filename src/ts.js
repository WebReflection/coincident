// this is here just to please TS ( it disappears once built )
export class CoincidentWorker extends Worker {
  constructor(url, options) {
    super(url, { ...options, type: 'module' });
    this.proxy = {};
  }
}
