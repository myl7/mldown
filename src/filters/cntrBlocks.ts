import {Filter} from './types'
import {Olist, Quote, Ulist} from '../ast/cntrBlocks'
import {or} from './op'
import {filter, parser} from './index'

export const quoteFilter: Filter = src => {
  if (!new RegExp(`^>([ \n]|$)`).test(src)) {
    return [src]
  }

  const lines = src.split('\n').reverse()
  let childLines = []
  const n = lines.length
  for (let i = 0; i < n; i++) {
    const line = lines.pop()!
    if (new RegExp(`^> `).test(line)) {
      childLines.push(line.substring(2))
    } else if (new RegExp(`^>$`).test(line)) {
      childLines.push('\n')
    } else {
      lines.push(line)
      break
    }
  }

  const remain = lines.reverse().join('\n')
  const content = childLines.join('\n') + '\n'
  const children = parser(content)
  return [remain, new Quote(children)]
}

export const ulistFilter: Filter = src => {
  if (!new RegExp(`^-([ \n]|$)`).test(src)) {
    return [src]
  }

  let items = []
  let isBlockItem = false
  let remain = src
  while (true) {
    let sep = remain.indexOf('\n')
    if (sep == -1) {
      sep = remain.length
    }
    const line = remain.substring(0, sep)

    if (new RegExp(`^- `).test(line) && !isBlockItem) {
      items.push(line.substring(2))
      remain = remain.substring(sep + 1)
    } else if (new RegExp(`^-$`).test(line) && !isBlockItem) {
      isBlockItem = true
      remain = remain.substring(sep + 1)
    } else if (isBlockItem) {
      const [newRemain, block] = filter(remain)
      if (block == undefined) {
        return [src]
      }

      remain = newRemain
      isBlockItem = false
      items.push(block)
    } else {
      break
    }
  }

  return [remain, new Ulist(items)]
}

export const olistFilter: Filter = src => {
  const res = new RegExp(`^(\d)\.(?:[ \n]|$)`).exec(src)
  if (!res) {
    return [src]
  }
  const startNum = parseInt(res[1])
  const start = startNum == 1 ? undefined : startNum

  let items = []
  let isBlockItem = false
  let remain = src
  while (true) {
    let sep = remain.indexOf('\n')
    if (sep == -1) {
      sep = remain.length
    }
    const line = remain.substring(0, sep)

    if (new RegExp(`^\d\. `).test(line) && !isBlockItem) {
      items.push(line.substring(3))
      remain = remain.substring(sep + 1)
    } else if (new RegExp(`^\d\.$`).test(line) && !isBlockItem) {
      isBlockItem = true
      remain = remain.substring(sep + 1)
    } else if (isBlockItem) {
      const [newRemain, block] = filter(remain)
      if (block == undefined) {
        return [src]
      }

      remain = newRemain
      isBlockItem = false
      items.push(block)
    } else {
      break
    }
  }

  return [remain, new Olist(items, start)]
}

export const cntrBlockFilter: Filter = or(quoteFilter, ulistFilter, olistFilter)
