from io import BytesIO
from .utils import Heap, JSMap, identity, loop_values, tv, from_key, to_symbol, to_key
from .utils.traps import UNREF, ASSIGN, EVALUATE, GATHER, QUERY, APPLY, CONSTRUCT, DEFINE_PROPERTY, DELETE_PROPERTY, GET, GET_OWN_PROPERTY_DESCRIPTOR, GET_PROTOTYPE_OF, HAS, IS_EXTENSIBLE, OWN_KEYS, SET, SET_PROTOTYPE_OF
from .utils.typed import to_buffer, to_view
from .direct.js import FinalizationRegistry, Null, Symbol, File, Blob
from .types import DIRECT, OBJECT, ARRAY, FUNCTION, REMOTE, SYMBOL, BIGINT, VIEW, BUFFER, REMOTE_OBJECT, REMOTE_ARRAY, REMOTE_FUNCTION

def local(reflect = identity, transform = identity, remote = identity, module = __import__, buffer = False, timeout = -1):
  def from_value(value, cache = None):
    if not isinstance(value, list):
      return value

    t, v = value

    if t == OBJECT:
      if v is Null:
        return __builtins__

      if cache is None:
        cache = JSMap()

      cached = cache.get(value)
      if not cached:
        cached = v
        cache.set(value, cached)
        for k in v:
          v[k] = from_value(v[k], cache)

      return cached

    if t == ARRAY:
      if cache is None:
        cache = JSMap()

      cached = cache.get(value)
      if not cached:
        cache.set(value, v)
        return from_values(v, cache)

      return cached
  
    if t == FUNCTION:
      wr = weak_refs.get(v)
      fn = wr() if wr else None
      if not fn:
        if wr: fr.unregister(wr)

        def _fn(*args):
          # TODO: self handling and **kwargs
          remote(*args)

          a = [to_value(arg) for arg in args]
          # k = {to_key(k): to_value(v) for k, v in kwargs.items()}

          result = reflect(APPLY, v, Null, a)
          return result.then(from_value)

        import weakref
        wr = weakref.ref(_fn)
        weak_refs.set(v, wr)
        fr.register(v, _fn, wr)
        fn = _fn

      return fn

    if t == SYMBOL:pass

    return heap.ref(v) if (t & REMOTE) else v

  # TODO
  def ref(v):
    return v

  # TODO
  def to_value(value):
    if value is not None and value is not True and value is not False and value is not Null:
      if callable(value):
        return tv(REMOTE_FUNCTION, heap.id(value))

      elif isinstance(value, Symbol):
        return tv(SYMBOL, to_symbol(value))

      elif isinstance(value, int):
        if value < -9007199254740991 or value > 9007199254740991:
          return tv(BIGINT, str(value))

      elif not isinstance(value, (float, str)):
        if value is __builtins__:
          return global_target
        # elif isinstance(value, (dict, list, tuple, bytes, bytearray, memoryview, complex, BytesIO)):
        else:
          v = transform(value)
          if has_direct and id(v) in direct or isinstance(v, BytesIO):
            return tv(DIRECT, v if isinstance(v, (File, Blob)) else v.getvalue())
          elif isinstance(v, memoryview):
            return tv(VIEW, to_view(v, buffer))
          elif isinstance(v, (bytes, bytearray)):
            return tv(BUFFER, to_buffer(v, buffer))
          elif isinstance(v, (list, tuple)):
            return tv(REMOTE_ARRAY, heap.id(v))
          else:
            return tv(REMOTE_OBJECT, heap.id(v))

    return value

  from_values = loop_values(from_value)
  from_keys = loop_values(from_key)
  to_keys = loop_values(to_key)
  heap = Heap()

  weak_refs = JSMap()
  global_target = tv(OBJECT, Null)
  has_direct = False
  direct = set()

  def finalizer(v):
    weak_refs.delete(v)
    reflect(UNREF, v)

  fr = FinalizationRegistry(finalizer)

  class Local:
    def clear(self):
      direct.clear()

    def direct(self, value):
      nonlocal has_direct

      if not has_direct:
        has_direct = True

      direct.add(id(value))
      return value

    def reflect(self, method, uid, *args):
      is_global = uid is Null
      target = __builtins__ if is_global else heap.ref(uid)

      if method == GET:
        key = from_key(args[0])
        as_module = is_global and key == 'import'
        if as_module:
          value = module
        else:
          try:
            value = object.__getattribute__(target, key)
          except:
            try:
              value = target[key]
            except:
              value = None
        result = to_value(value)
        return result

      if method == APPLY:
        map = JSMap()
        # TODO: **kwargs as context?
        value = target(*from_values(args[1], map))
        return to_value(value)

      if method == SET:
        key = from_key(args[0])
        value = from_value(args[1])
        try:
          target[key] = value
          return True
        except:
          return False

      if method == HAS:
        key = from_key(args[0])
        return key in target

      if method == OWN_KEYS:
        return to_keys([k for k in target.keys()], weak_refs)

      if method == CONSTRUCT:
        value = target(*from_values(args[0]))
        return to_value(value)

      if method == GET_OWN_PROPERTY_DESCRIPTOR:
        key = from_key(args[0])
        if key in target:
          return to_value({ "enumerable": True, "configurable": True, "writable": True, "value": to_value(target[key]) })
        return None

      if method == DEFINE_PROPERTY:
        key = from_key(args[0])
        value = from_value(args[1])
        try:
          target[key] = value
          return True
        except:
          return False

      if method == DELETE_PROPERTY:
        key = from_key(args[0])
        try:
          del target[key]
          return True
        except:
          return False

      if method == GET_PROTOTYPE_OF:
        return Null

      if method == SET_PROTOTYPE_OF:
        return False

      if method == UNREF:
        return heap.unref(uid)

      if method == IS_EXTENSIBLE:
        return True

    def terminate(self):
      for wr in weak_refs.values():
        fr.unregister(wr)

      weak_refs.clear()
      heap.clear()


  return Local()
