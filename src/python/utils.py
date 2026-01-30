import inspect

# see https://github.com/micropython/micropython/blob/023a49c55ed5f3ebabab8969013533dfbdfdff33/tools/mpy-tool.py#L141
# see https://github.com/micropython/micropython/blob/023a49c55ed5f3ebabab8969013533dfbdfdff33/tests/basics/special_methods.py#L1
# see https://github.com/micropython/micropython/blob/023a49c55ed5f3ebabab8969013533dfbdfdff33/tests/basics/special_methods2.py#L1

callable_types = ('isclass', 'iscoroutine', 'iscoroutinefunction', 'isfunction', 'isgenerator', 'isgeneratorfunction', 'ismethod')
primitive_types = (str, int, float, bool, type(None))

def compare(method, ref, other):
  # TODO: if other is remote call it while if local TBD
  request(ref, method, other)
  return print(method, "TBD")

def is_callable(obj):
  return any(getattr(inspect, kind)(obj) for kind in callable_types)

def is_primitive(obj):
  return type(obj) in primitive_types

def result(value):
  return value if is_primitive(value) else Proxy(value)

def request(remote, method, *args, **kwargs):
  print("request", id(remote), method, args, kwargs)

class Proxy:
  # Object lifecycle & representation
  def __init__(self, ref):
    object.__setattr__(self, "__remote__", ref)
    # TODO: implement a finalizer, i.e.
    # fr = FinaliazionRegistry(lambda ref: request(ref, "__del__"))
    # fr.register(self, ref)

  # This requires a finalizer in the mpy runtime or
  # https://docs.python.org/3/library/weakref.html#weakref.finalize
  # when the proxy is gone, this method should be called somehow
  # def __del__(self):
  #   request(self.__remote__, "__del__")

  #TODO: isinstance?


  # repr(p) -> () {}
  def __repr__(self):
    request(self.__remote__, "__repr__")
    return repr(self.__remote__)

  # str(p) -> () {}
  def __str__(self):
    request(self.__remote__, "__str__")
    return str(self.__remote__)

  # Attribute access
  # p.key -> (key,) {}
  def __getattr__(self, name):
    request(self.__remote__, "__getattr__", name)
    return result(getattr(self.__remote__, name))

  # p.key = value -> (key, value) {}
  def __setattr__(self, name, value):
    request(self.__remote__, "__setattr__", name, value)
    return setattr(self.__remote__, name, value)

  # del p.key -> (key,) {}
  def __delattr__(self, name):
    request(self.__remote__, "__delattr__", name)
    return delattr(self.__remote__, name)

  # dir(p) -> () {}
  def __dir__(self):
    request(self.__remote__, "__dir__")
    return Proxy(dir(self.__remote__))

  # Container protocol

  # len(p) -> () {}
  def __len__(self):
    request(self.__remote__, "__len__")
    return len(self.__remote__)

  # p[key] -> (key,) {}
  def __getitem__(self, name):
    request(self.__remote__, "__getitem__", name)
    return result(self.__remote__[name])

  # p[key] = value -> (key, value) {}
  def __setitem__(self, name, value):
    request(self.__remote__, "__setitem__", name, value)
    self.__remote__[name] = value

  # del p[key] -> (key,) {}
  def __delitem__(self, name):
    request(self.__remote__, "__delitem__", name)
    del self.__remote__[name]

  # iter(p) -> () {}
  def __iter__(self):
    request(self.__remote__, "__iter__")
    return Proxy(iter(self.__remote__))

  # next(p) -> () {}
  def __next__(self):
    request(self.__remote__, "__next__")
    return result(next(self.__remote__))

  # in p -> (item,) {}
  def __contains__(self, name):
    request(self.__remote__, "__contains__", name)
    return name in self.__remote__

  # Numeric & comparison operators
  # p + other -> (other,) {}
  def __add__(self, other):
    return compare("__add__", self.__remote__, other)

  # p - other -> (other,) {}
  def __sub__(self, other):
    return compare("__sub__", self.__remote__, other)

  # p * other -> (other,) {}
  def __mul__(self, other):
    return compare("__mul__", self.__remote__, other)

  # p / other -> (other,) {}
  def __truediv__(self, other):
    return compare("__truediv__", self.__remote__, other)

  # p // other -> (other,) {}
  def __floordiv__(self, other):
    return compare("__floordiv__", self.__remote__, other)

  # p % other -> (other,) {}
  def __mod__(self, other):
    return compare("__mod__", self.__remote__, other)

  # p ** other -> (other,) {}
  def __pow__(self, other):
    return compare("__pow__", self.__remote__, other)

  # other + p -> (other,) {}
  def __radd__(self, other):
    return compare("__radd__", self.__remote__, other)

  # other - p -> (other,) {}
  def __rsub__(self, other):
    return compare("__rsub__", self.__remote__, other)

  # other * p -> (other,) {}
  def __rmul__(self, other):
    return compare("__rmul__", self.__remote__, other)

  # other / p -> (other,) {}
  def __rtruediv__(self, other):
    return compare("__rtruediv__", self.__remote__, other)

  # other // p -> (other,) {}
  def __rfloordiv__(self, other):
    return compare("__rfloordiv__", self.__remote__, other)

  # other % p -> (other,) {}
  def __rmod__(self, other):
    return compare("__rmod__", self.__remote__, other)

  # other ** p -> (other,) {}
  def __rpow__(self, other):
    return compare("__rpow__", self.__remote__, other)

  # -p -> () {}
  def __neg__(self):
    request(self.__remote__, "__neg__")
    return 0

  # +p -> () {}
  def __pos__(self):
    request(self.__remote__, "__pos__")
    return 0

  # abs(p) -> () {}
  def __abs__(self):
    request(self.__remote__, "__abs__")
    return 0

  # p == other -> (other,) {}
  def __eq__(self, other):
    return True if isinstance(other, Proxy) and getattr(other, "__remote__") == self.__remote__ else False

  # p != other -> (other,) {}
  def __ne__(self, other):
    return not self.__eq__(other)

  # p < other -> (other,) {}
  def __lt__(self, other):
    return compare("__lt__", self.__remote__, other)

  # p <= other -> (other,) {}
  def __le__(self, other):
    return compare("__le__", self.__remote__, other)

  # p > other -> (other,) {}
  def __gt__(self, other):
    return compare("__gt__", self.__remote__, other)

  # p >= other -> (other,) {}
  def __ge__(self, other):
    return compare("__ge__", self.__remote__, other)

  # Callable & context manager
  # p(*args, **kwargs) -> args, kwargs
  def __call__(self, *args, **kwargs):
    request(self.__remote__, "__call__", *args, **kwargs)
    return result(self.__remote__(*args, **kwargs))

  # with p as f: -> args
  def __enter__(self, *args):
    request(self.__remote__, "__enter__", *args)
    return self.__remote__

  # with p as f: break -> args
  def __exit__(self, *args, **kwargs):
    request(self.__remote__, "__exit__", *args)
    return self.__remote__

  # Special cases
  # hash(p) -> () {}
  def __hash__(self):
    request(self.__remote__, "__hash__")
    return hash(self.__remote__)

  # bool(p) -> () {}
  def __bool__(self):
    request(self.__remote__, "__bool__")
    return bool(self.__remote__)

  # NOT SUPPORTED ???
  # def __index__(self, *args, **kwargs):
  #   print("__index__", args, kwargs)

  # reversed(p) -> () {}
  def __reversed__(self, *args, **kwargs):
    request(self.__remote__, "__reversed__")
    return Proxy(reversed(self.__remote__))
