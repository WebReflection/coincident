i = 0

def next():
  global i
  v = i
  i += 1
  return v

FALSE = next()
TRUE = next()

UNDEFINED = next()
NULL = next()

NUMBER = next()
UI8 = next()
NAN = next()
INFINITY = next()
N_INFINITY = next()
ZERO = next()
N_ZERO = next()

BIGINT = next()
BIGUINT = next()

STRING = next()

SYMBOL = next()

ARRAY = next()
BUFFER = next()
DATE = next()
ERROR = next()
MAP = next()
OBJECT = next()
REGEXP = next()
SET = next()
VIEW = next()

IMAGE_DATA = next()
BLOB = next()
FILE = next()

FOREIGN_ARRAY = next()
FOREIGN_SET = next()

RECURSION = next()

POSITIVE_INFINITY = float('inf')
NEGATIVE_INFINITY = float('-inf')
