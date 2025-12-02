import struct

try:
  int.from_bytes(b'', byteorder='little')
  from_bytes = lambda value, byteorder: int.from_bytes(value, byteorder=byteorder)
except:
  from_bytes = lambda value, byteorder: int.from_bytes(bytes(value), byteorder)

BIG_INT_64_MAX = 9223372036854775807
BIG_UINT_64_MAX = 18446744073709551615

def endianness(littleEndian):
  return 'little' if littleEndian else 'big'

# MicroPython fallback
as_number = lambda num: int(num) if num.is_integer() else num
as_integer = lambda num: num.is_integer()
try:
  float(0).is_integer()
except:
  as_number = lambda num: num if num != int(num) else int(num)

class DataView:
  def __init__(self, buffer):
    self.buffer = buffer

  def getBigInt64(self, byteOffset, littleEndian):
    bui = self.getBigUint64(byteOffset, littleEndian)
    if bui > BIG_INT_64_MAX:
      return bui - (BIG_UINT_64_MAX + 1)
    else:
      return bui

  def getBigUint64(self, byteOffset, littleEndian):
    bo = endianness(littleEndian)
    return from_bytes(self.buffer[byteOffset:byteOffset+8], bo)

  def getFloat64(self, byteOffset, littleEndian):
    bo = endianness(littleEndian)
    i = from_bytes(self.buffer[byteOffset:byteOffset+8], bo)
    return as_number(struct.unpack('d', i.to_bytes(8, bo))[0])

  def getUint32(self, byteOffset, littleEndian):
    bo = endianness(littleEndian)
    return from_bytes(self.buffer[byteOffset:byteOffset+4], bo)

  def setBigInt64(self, byteOffset, value, littleEndian):
    return self.setBigUint64(byteOffset, value, littleEndian)

  def setBigUint64(self, byteOffset, value, littleEndian):
    bo = endianness(littleEndian)
    bytes = value.to_bytes(8, bo)
    for i in range(8):
      self.buffer[byteOffset+i] = bytes[i]

  def setUint32(self, byteOffset, value, littleEndian):
    bo = endianness(littleEndian)
    bytes = value.to_bytes(4, bo)
    for i in range(4):
      self.buffer[byteOffset+i] = bytes[i]

  def setFloat64(self, byteOffset, value, littleEndian):
    bytes = struct.pack('<d' if littleEndian else '>d', value)
    for i in range(8):
      self.buffer[byteOffset+i] = bytes[i]

u8a8 = [0] * 8
dv = DataView(u8a8)
