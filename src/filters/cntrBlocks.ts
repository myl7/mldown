import {Filter} from './types'
import {Olist, Quote, Ulist} from '../ast/cntrBlocks'
import {AstNode} from '../ast/types'

const lineMarkerFilter = (marker: string, builder: (lines: string[]) => AstNode): Filter => {
  return src => {
    if (!new RegExp(`^${marker}([ \n]|$)`).test(src)) {
      return [src]
    }

    const lines = src.split('\n').reverse()
    let childLines = []
    const n = lines.length
    for (let i = 0; i < n; i++) {
      const line = lines.pop()!
      if (new RegExp(`^${marker} `).test(line)) {
        childLines.push(line.substring(2))
      } else if (new RegExp(`^${marker}$`).test(line)) {
        childLines.push('\n')
      } else {
        lines.push(line)
        break
      }
    }

    const remain = lines.reverse().join('\n')
    return [remain, builder(childLines)]
  }
}

export const quoteFilter: Filter = lineMarkerFilter('>', lines => new Quote([]))
export const ulistFilter: Filter = lineMarkerFilter('-', lines => new Ulist([]))
export const olistFilter: Filter = lineMarkerFilter('\d', lines => new Olist([]))
