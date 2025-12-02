i = 0

def next():
  global i
  v = i
  i += 1
  return v

# extras
UNREF = next()
ASSIGN = next()
EVALUATE = next()
GATHER = next()
QUERY = next()

# traps
APPLY = next()
CONSTRUCT = next()
DEFINE_PROPERTY = next()
DELETE_PROPERTY = next()
GET = next()
GET_OWN_PROPERTY_DESCRIPTOR = next()
GET_PROTOTYPE_OF = next()
HAS = next()
IS_EXTENSIBLE = next()
OWN_KEYS = next()
PREVENT_EXTENSIONS = next()
SET = next()
SET_PROTOTYPE_OF = next()
