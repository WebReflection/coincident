import asyncio, io
from datetime import datetime

__all__ = ["Blob", "File", "Map", "NaN", "Null", "Promise", "Set", "Symbol", "symbols"]

NaN = float('nan')

def now():
  return int(datetime.now().timestamp() * 1000)

class Null:
  def __bool__(self, *args, **kwargs):
    return False

  def __eq__(self, *args, **kwargs):
    return args[0] is Null

  def __hash__(self, *args, **kwargs):
    return -hash(None)

  def __repr__(self, *args, **kwargs):
    return 'Null'

  def __str__(self, *args, **kwargs):
    return 'Null'

# differently from None, Null is an immutable singleton
# that does not returns True from `if Null` checks
# and it guarantees to not fail `is Null` checks
Null = Null()

class Map(dict): pass

class Set(list):
  def add(self, value):
    if value not in self:
      self.append(value)


class Blob(io.BytesIO):
  type = ''
  size = 0

  def __init__(self, buffer, options=None):
    if options is None or options is Null:
      options = {}

    super().__init__(buffer)
    self.type = options.get('type', '')
    self.size = options.get('size', len(buffer))


class File(Blob):
  name = ''
  lastModified = 0

  def __init__(self, buffer, name, options=None):
    if options is None or options is Null:
      options = {}

    super().__init__(buffer, options)
    self.name = name
    self.lastModified = options.get('lastModified', now())

def resolver(value, wait=True):
  if asyncio.iscoroutine(value):
    task = asyncio.create_task(value)
    if wait:
      async def wait(resolve, reject):
        try:
          resolve(await task)
        except Exception as e:
          reject(e)

      value = Promise(wait)

  return value

class PromiseWithResolvers:
  def __init__(self):
    self.resolve = None
    self.reject = None
    self.promise = None

class Promise(asyncio.Future):

  async def value(promise):
    while isinstance(promise, Promise):
      promise = await promise

    return promise

  def with_resolvers():
    ref = PromiseWithResolvers()

    def fn(resolve, reject):
      ref.resolve = resolve
      ref.reject = reject

    ref.promise = Promise(fn)
    return ref

  def __init__(self, fn):
    super().__init__()
    this = self

    def resolve(value):
      this.set_result(value)

    def reject(reason):
      this.set_exception(reason)

    resolver(fn(resolve, reject), wait=False)

  def then(self, resolve, reject=None):
    p = Promise.with_resolvers()

    def done(future):
      try:
        result = future.result()
        if resolve:
          p.resolve(resolver(resolve(result)))

      except Exception as e:
        if reject:
          p.reject(resolver(reject(e)))

        else:
          raise e

    self.add_done_callback(done)

    return p.promise

  def catch(self, on_rejected):
    return self.then(None, on_rejected)


try:
  import weakref

  class FinalizationRegistry:
    WEAKREF = True

    def __init__(self, callback):
      _registry = {}
      self._registry = _registry
      self._registered = weakref.WeakSet()

      def _callback(id, heldValue):
        if id is not None:
          del _registry[id]

        callback(heldValue)

      self._callback = _callback

    def register(self, target, heldValue, token = None):
      if target in self._registered:
        return

      self._registered.add(target)

      args = [target, self._callback, None, heldValue]

      if token is None:
        weakref.finalize(*args)

      else:
        uid = id(token)
        args[2] = uid
        self._registry[uid] = weakref.finalize(*args)

    def unregister(self, token):
      uid = id(token)
      if uid in self._registry:
        self._registry[uid].detach()
        del self._registry[uid]

except:
  class FinalizationRegistry:
    WEAKREF = False

    def __init__(self, callback):
      pass

    def register(self, target, heldValue, token = None):
      pass

    def unregister(self, token):
      pass


# C-Python compatibility
try:
  str().__new__

  class Symbol(str):
    def __new__(cls, name):
      return str.__new__(cls, f'Symbol[{len(name)}].{name}')

# MicroPython compatibility
except:
  class Symbol(str):
    def __init__(self, name):
      super().__init__(f'Symbol[{len(name)}].{name}')

symbols = {}

for _ in ["asyncIterator", "hasInstance", "isConcatSpreadable", "iterator", "match", "matchAll", "replace", "search", "species", "split", "toPrimitive", "toStringTag", "unscopables", "dispose", "asyncDispose"]:
  symbol = Symbol(f'@{_}')
  symbols[symbol] = symbol
