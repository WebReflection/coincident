from reflected_ffi.direct.js import Promise

def next_resolver(typed = int):
  map = {}
  id = 0

  def next():
    nonlocal id

    while True:
      uid = typed(id)
      id += 1
      if not uid in map:
        break

    wr = Promise.with_resolvers()
    map[uid] = wr
    return [uid, wr.promise]

  def resolver(uid, value, error=None):
    if uid in map:
      wr = map[uid]
      del map[uid]

      if error:
        wr.reject(error)
      else:
        wr.resolve(value)

  return [next, resolver]
