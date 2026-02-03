import re
from datetime import datetime, timezone

from .js import Blob, File, Map, Null, Set, Symbol, NaN, symbols
from .types import POSITIVE_INFINITY, NEGATIVE_INFINITY, FALSE, TRUE, NULL, NUMBER, UI8, NAN, INFINITY, N_INFINITY, ZERO, N_ZERO, BIGINT, BIGUINT, STRING, SYMBOL, ARRAY, BUFFER, DATE, ERROR, MAP, OBJECT, REGEXP, SET, VIEW, IMAGE_DATA, BLOB, FILE, FOREIGN_ARRAY, FOREIGN_SET, RECURSION
from .views import dv, u8a8

__all__ = ["decode", "decoder"]

i = 0

def _(cache, index, value):
  cache[index] = value
  return value

def number(input):
  global i
  u8a8[0] = input[i]
  u8a8[1] = input[i+1]
  u8a8[2] = input[i+2]
  u8a8[3] = input[i+3]
  u8a8[4] = input[i+4]
  u8a8[5] = input[i+5]
  u8a8[6] = input[i+6]
  u8a8[7] = input[i+7]
  i += 8

def size(input):
  global i
  u8a8[0] = input[i]
  u8a8[1] = input[i+1]
  u8a8[2] = input[i+2]
  u8a8[3] = input[i+3]
  i += 4
  return dv.getUint32(0, True)

def deflate(input, cache):
  global i
  c = input[i]
  i += 1

  if c == NUMBER:
    number(input)
    return dv.getFloat64(0, True)

  if c == UI8:
    v = input[i]
    i += 1
    return v

  if c == OBJECT:
    object = _(cache, i - 1, {})
    j = 0
    length = size(input)
    while j < length:
      key = deflate(input, cache)
      object[key] = deflate(input, cache)
      j += 1
    return object

  if c == FOREIGN_ARRAY:
    index = i - 1
    array = _(cache, index, [])
    j = 0
    length = size(input)
    while j < length:
      array.append(deflate(input, cache))
      j += 1
    cache[index] = tuple(array)
    return cache[index];

  if c == ARRAY:
    array = _(cache, i - 1, [])
    j = 0
    length = size(input)
    while j < length:
      array.append(deflate(input, cache))
      j += 1
    return array;

  if c == VIEW:
    index = i - 1
    name = deflate(input, cache)
    return _(cache, index, memoryview(deflate(input, cache)))

  if c == BUFFER:
    index = i - 1
    length = size(input)
    start = i
    i += length
    return _(cache, index, bytearray(input[start:i]))

  if c == STRING:
    index = i - 1
    length = size(input)
    start = i
    i += length
    return _(cache, index, bytes(input[start:i]).decode('utf-8'))

  if c == DATE:
    index = i - 1
    value = deflate(input, cache) / 1000
    return _(cache, index, datetime.fromtimestamp(value, timezone.utc))

  if c == MAP:
    m = _(cache, i - 1, Map())
    for j in range(size(input)):
      key = deflate(input, cache)
      m[key] = deflate(input, cache)
    return m

  if c == FOREIGN_SET:
    s = _(cache, i - 1, set())
    for j in range(size(input)):
      s.add(deflate(input, cache))
    return s

  if c == SET:
    s = _(cache, i - 1, Set())
    for j in range(size(input)):
      s.append(deflate(input, cache))
    return s

  if c == ERROR:
    index = i - 1
    name = deflate(input, cache)
    message = deflate(input, cache)
    stack = deflate(input, cache)
    return _(cache, index, Exception(message, { "stack": stack, "name": name }))

  if c == REGEXP:
    index = i - 1
    source = deflate(input, cache)
    flags = deflate(input, cache)

    # ⚠️ not all JS flags are supported by Python (and vice-versa)
    # C-Python compatibility - also re.U is there by default
    try:
      pflags = 0
      for c in flags:
        if c == 'i':
          pflags |= re.I
        elif c == 'm':
          pflags |= re.M
        elif c == 's':
          pflags |= re.S
        elif c == 'u':
          pflags |= re.U

      value = re.compile(source, flags=pflags)

    # MicroPython compatibility
    except:
      value = re.compile(source)

    return _(cache, index, value)

  if c == FALSE: return False

  if c == TRUE: return True

  if c == NAN: return NaN

  if c == INFINITY: return POSITIVE_INFINITY

  if c == N_INFINITY: return NEGATIVE_INFINITY

  if c == ZERO: return 0

  if c == N_ZERO: return -0

  if c == NULL: return Null

  if c == BIGINT:
    number(input)
    return dv.getBigInt64(0, True)

  if c == BIGUINT:
    number(input)
    return dv.getBigUint64(0, True)

  if c == RECURSION: return cache.get(size(input))

  if c == BLOB:
    index = i - 1
    t = deflate(input, cache)
    s = deflate(input, cache)
    return _(cache, index, Blob(input[i:i+s], { 'type': t, 'size': s }))

  if c == FILE:
    index = i - 1
    name = deflate(input, cache)
    lastModified = deflate(input, cache)
    blob = deflate(input, cache)
    return _(cache, index, File(blob.getvalue(), name, { 'type': blob.type, 'lastModified': lastModified }))

  if c == SYMBOL:
    return symbols[Symbol(deflate(input, cache))]

  return None

def decode(input):
  global i
  i = 0
  return deflate(input, {})

def decoder(byteOffset = 0):
  return lambda length, buffer: decode(memoryview(buffer)[byteOffset:byteOffset+length])
