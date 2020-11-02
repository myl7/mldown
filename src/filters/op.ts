import {Filter} from './types'

const or2 = (a: Filter, b: Filter): Filter => {
  return src => {
    const res = a(src)
    if (res[1]) {
      return res
    }
    return b(src)
  }
}

export const or = (...filters: Filter[]): Filter => {
  return filters.reduce(or2)
}
