def to_buffer(value, direct):
  return [value if direct else bytes(value), 0]

def to_view(value, direct):
  buffer = bytes(value)
  return ['Uint8Array', to_buffer(buffer, True), 0, len(buffer)]
