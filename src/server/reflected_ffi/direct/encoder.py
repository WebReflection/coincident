import io, re, struct
from datetime import datetime, timezone

from .js import Blob, File, Map, Null, Set, Symbol, NaN
from .types import POSITIVE_INFINITY, NEGATIVE_INFINITY, FALSE, TRUE, NULL, UNDEFINED, NUMBER, UI8, NAN, INFINITY, N_INFINITY, ZERO, N_ZERO, BIGINT, BIGUINT, STRING, SYMBOL, ARRAY, BUFFER, DATE, ERROR, MAP, OBJECT, REGEXP, SET, VIEW, IMAGE_DATA, BLOB, FILE, FOREIGN_ARRAY, FOREIGN_SET, RECURSION
from .views import dv, u8a8

__all__ = ["encode", "encoder"]

# TODO: MicroPython does not expose pattern and/or flags
try:
  re.Pattern
  with_regexp = True
except:
  with_regexp = False

class Cache:
  def __init__(self):
    self.i = []
    self.v = []

def append(output, type, length):
  dv.setUint32(0, length, True)
  output.append(type)
  output.extend(u8a8[0:4])

def append_array(type, input, output, cache):
  append(output, type, len(input))
  for value in input:
    inflate(value, output, cache)

def append_set(type, input, output, cache):
  append(output, type, len(input))
  for value in input:
    inflate(value, output, cache)

def append_object(type, input, output, cache):
  items = [[k, v] for k, v in input.items()]
  append(output, type, len(items))
  for key, value in items:
    inflate(key, output, cache)
    inflate(value, output, cache)

def process(input, output, cache):
  if input in cache.i:
    output.append(RECURSION)
    output.extend(cache.v[cache.i.index(input)])
    return False
  else:
    dv.setUint32(0, len(output), True)
    cache.i.append(input)
    cache.v.append(u8a8[0:4])
    return True

def inflate(input, output, cache):
  if input is None:
    output.append(UNDEFINED)

  elif input is Null:
    output.append(NULL)

  elif input is True:
    output.append(TRUE)

  elif input is False:
    output.append(FALSE)

  elif isinstance(input, int):
    if input < 256 and -1 < input:
      output.append(UI8)
      output.append(input)
    else:
      if 9223372036854775807 < input:
        output.append(BIGUINT)
        dv.setBigUint64(0, input, True)
      elif input < -9007199254740991 or input > 9007199254740991:
        output.append(BIGINT)
        dv.setBigInt64(0, input, True)
      else:
        output.append(NUMBER)
        dv.setFloat64(0, input, True)
      output.extend(u8a8)

  elif isinstance(input, float):
    if input == POSITIVE_INFINITY:
      output.append(INFINITY)
    elif input == NEGATIVE_INFINITY:
      output.append(N_INFINITY)
    elif input == NaN:
      output.append(NAN)
    else:
      if not input:
        output.append(ZERO if struct.pack('f', input)[3] == 0 else N_ZERO)
      else:
        output.append(NUMBER)
        dv.setFloat64(0, input, True)
        output.extend(u8a8)

  elif isinstance(input, Symbol):
    output.append(SYMBOL)
    inflate(str(input), output, cache)

  elif process(input, output, cache):
    if isinstance(input, str):
      utf8 = input.encode('utf-8')
      append(output, STRING, len(utf8))
      output.extend(utf8)

    elif isinstance(input, Set):
      append_set(SET, input, output, cache)

    elif isinstance(input, Map):
      append_object(MAP, input, output, cache)

    elif isinstance(input, set):
      append_set(FOREIGN_SET, input, output, cache)

    elif isinstance(input, tuple):
      append_array(FOREIGN_ARRAY, input, output, cache)

    elif isinstance(input, list):
      append_array(ARRAY, input, output, cache)

    elif isinstance(input, dict):
      append_object(OBJECT, input, output, cache)

    elif isinstance(input, memoryview):
      output.append(VIEW)
      inflate('Uint8Array', output, cache)
      # TODO: shared bytearray here causes issues in cache
      append(output, BUFFER, len(input))
      output.extend(input)

    elif isinstance(input, (bytes, bytearray)):
      append(output, BUFFER, len(input))
      output.extend(input)
    
    elif isinstance(input, datetime):
      output.append(DATE)
      input = input.replace(tzinfo=timezone.utc)
      inflate(int(input.timestamp() * 1000), output, cache)

    elif isinstance(input, io.BytesIO):
      value = input.getvalue()
      if isinstance(input, File):
        output.append(FILE)
        inflate(input.name, output, cache);
        inflate(input.lastModified, output, cache)

      output.append(BLOB)
      if isinstance(input, Blob):
        inflate(input.type, output, cache)
        inflate(input.size, output, cache)
      else:
        inflate('', output, cache)
        inflate(len(value), output, cache)
      output.extend(value)

    elif isinstance(input, Exception):
      output.append(ERROR)
      inflate(str(input.__class__.__name__), output, cache)
      inflate(input.args[0], output, cache)
      s = ''
      if len(input.args) > 1:
        details = input.args[1]
        if isinstance(details, str):
          s = details
        elif isinstance(details, dict):
          s = details.get('stack', '')
      inflate(s, output, cache)

    elif with_regexp and isinstance(input, re.Pattern):
      output.append(REGEXP)
      inflate(input.pattern, output, cache)
      flags = ''
      if input.flags & re.I:
        flags += 'i'
      if input.flags & re.M:
        flags += 'm'
      if input.flags & re.S:
        flags += 's'
      if input.flags & re.U:
        flags += 'u'
      inflate(flags, output, cache)

    else:
      raise ValueError(f'Unsupported type: {type(input)}')

def encode(value):
  output = bytearray()
  inflate(value, output, Cache())
  return output

def encoder(byteOffset = 0):
  def _(value):
    output = encode(value)
    length = len(output)
    if byteOffset > 0:
      output = ([0] * byteOffset) + output
    return [length, output]

  return _
