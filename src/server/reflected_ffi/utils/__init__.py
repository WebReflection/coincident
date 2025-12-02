from ..types import DIRECT, SYMBOL
from ..direct.js import Symbol, symbols

class JSMap:
  _k = []
  _v = []

  def __init__(self, pairs = []):
    self._k = []
    self._v = []
    for pair in pairs:
      self.set(pair[0], pair[1])

  def clear(self):
    self._k.clear()
    self._v.clear()

  def delete(self, key):
    if self.has(key):
      self._v.remove(self._v[self._k.index(key)])
      self._k.remove(key)
      return True

    return False

  def has(self, key):
    return key in self._k

  def get(self, key):
    if self.has(key):
      return self._v[self._k.index(key)]

  def set(self, key, value):
    if self.has(key):
      self[self.index(key) + 1] = value
    else:
      self._k.append(key)
      self._v.append(value)
    return self

  def __str__(self):
    return [pair for pair in self]

  def __repr__(self):
    return f"JSMap({self})"

  def __iter__(self):
    for i in range(0, len(self._k)):
      yield [self._k[i], self._v[i]]

INT_MAX = 2147483648

def Heap(i = 0, ids = None, refs = None):
  if ids is None:
    ids = JSMap()

  if refs is None:
    refs = JSMap()

  class heap:
    def clear(self):
      ids.clear()
      refs.clear()

    def id(self, ref):
      nonlocal i
      uid = refs.get(ref)
      if uid is None:
        while True:
          uid = i
          i += 1
          if i == INT_MAX:
            i *= -1
          if not ids.has(uid):
            break

        ids.set(uid, ref)
        refs.set(ref, uid)

      return uid

    def ref(self, id):
      return ids.get(id)

    def unref(self, id):
      refs.delete(ids.get(id))
      return ids.delete(id)

  return heap()

identity = lambda value: value

tv = lambda type, value: [type, value]

array = []
object = {}
callback = lambda *args, **kwargs: None

def loop_values(as_value):
  def loop(arr, cache = None):
    if cache is None:
      cache = JSMap()

    for i in range(len(arr)):
      arr[i] = as_value(arr[i], cache)

    return arr

  return loop

from_symbol = lambda value: symbols[Symbol(value)]

def to_symbol(value):
  s = str(value)
  return s[s.index('@'):]

from_key = lambda tv: tv[1] if tv[0] == DIRECT else from_symbol(tv[1])

to_key = lambda value: tv(SYMBOL, to_symbol(value)) if isinstance(value, Symbol) else tv(DIRECT, value)
