export default function makeOrderedDictionary<T>(idGetter: (item: T) => string) {
  const array: T[] = []
  const dict: Record<string, T> = {}

  const get = (id: string): T | undefined => dict[id]

  const update = (item: T): boolean => {
    const id = idGetter(item)
    const idx = array.findIndex(i => idGetter(i) === id)
    if (idx >= 0) {
      array[idx] = item
      dict[id] = item
      return true
    }
    return false
  }

  const upsert = (item: T, mode: 'append' | 'prepend' = 'append'): void => {
    const id = idGetter(item)
    if (get(id)) {
      update(item)
    } else {
      if (mode === 'append') {
        array.push(item)
      } else {
        array.unshift(item)
      }
      dict[id] = item
    }
  }

  const remove = (item: T): boolean => {
    const id = idGetter(item)
    const idx = array.findIndex(i => idGetter(i) === id)
    if (idx >= 0) {
      array.splice(idx, 1)
      delete dict[id]
      return true
    }
    return false
  }

  const updateAssign = (id: string, updateObj: Partial<T>): boolean => {
    const item = get(id)
    if (item) {
      Object.assign(item, updateObj)
      delete dict[id]
      dict[idGetter(item)] = item
      return true
    }
    return false
  }

  const clear = (): void => {
    array.length = 0
    for (const key of Object.keys(dict)) {
      delete dict[key]
    }
  }

  const filter = (contain: (item: T) => boolean): void => {
    let i = 0
    while (i < array.length) {
      if (!contain(array[i])) {
        delete dict[idGetter(array[i])]
        array.splice(i, 1)
      } else {
        i++
      }
    }
  }

  const toJSON = (): T[] => array

  const fromJSON = (newItems: T[]): void => {
    array.splice(0, array.length, ...newItems)
    for (const item of newItems) {
      dict[idGetter(item)] = item
    }
  }

  return {
    array,
    get,
    upsert,
    update,
    remove,
    updateAssign,
    clear,
    filter,
    toJSON,
    fromJSON
  }
}