from utils import Proxy

class Test(dict):
  def __init__(self):
    self.test = 0

o = Proxy(Test())

with o as f:
  print("__enter__", f)

if o == o:
  print("o == o")

o.test = 123
assert o.test == 123

o["test"] = 123
assert o["test"] == 123

items = []
for k,v in o.items():
  items.append((k, v))

assert items == [("test", 123)]

# del o.test
del o["test"]

assert "test" not in o

assert repr(o) == repr({})
assert hash(Proxy((1,2,3))) != 0
assert bool(Proxy(0)) == False
assert len(Proxy((1,2,3))) == 3

for item in reversed(Proxy((1,2,3))):
    print(item)

del o
o = None

Proxy(lambda *args, **kwargs: print("__call__", args, kwargs))(1, b=2)
