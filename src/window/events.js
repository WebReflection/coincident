const { addEventListener } = EventTarget.prototype;
const eventsHandler = new WeakMap;
Reflect.defineProperty(EventTarget.prototype, 'addEventListener', {
  value(type, listener, ...options) {
    const invoke = options.at(0)?.invoke;
    if (invoke) {
      let map = eventsHandler.get(this);
      if (!map) {
        map = new Map;
        eventsHandler.set(this, map);
      }
      map.set(type, [].concat(invoke));
      delete options[0].invoke;
    }
    return addEventListener.call(this, type, listener, ...options);
  },
});

export default event => {
  const { currentTarget, target, type } = event;
  const methods = eventsHandler.get(currentTarget || target)?.get(type);
  if (methods) for (const method of methods) event[method]();
};
