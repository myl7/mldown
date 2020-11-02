import {Filter} from './types'
import {Tbreak, H1, H2, H3, H4, H5, H6, CodeBlock, Raw, Paragraph, BlankLine} from '../ast/leafBlocks'
import {or} from './op'

export const tbreakFilter: Filter = src => {
  if (!/^---\n/.test(src)) {
    return [src]
  }

  const remain = src.substring(4)
  return [remain, new Tbreak()]
}

const hFilterBuilder = (i: number): Filter => {
  return src => {
    const res = new RegExp(`^${'#'.repeat(i)} ([^\n])\n`).exec(src)
    if (!res) {
      return [src]
    }

    const remain = src.substring(res[0].length)
    const title = res[1]
    const Head = [undefined, H1, H2, H3, H4, H5, H6][i]!
    return [remain, new Head(title)]
  }
}

export const hFilter = or(...Array(6).map((_, i) => hFilterBuilder(i + 1)))

export const codeBlockFilter: Filter = src => {
  let res = /^```([\n]*)\n/.exec(src)
  if (!res) {
    return [src]
  }

  let remain = src.substring(res[0].length)
  const infoStr = src[1] ? src[1] : undefined

  let sep = remain.search(/\n```(\n|$)/)
  if (sep == -1) {
    sep = remain.length
  }
  const content = remain.substring(0, sep)
  remain = remain.substring(sep + 5)
  return [remain, new CodeBlock(content, infoStr)]
}

// Tmp solution.
export const rawFilter: Filter = src => {
  let res = /^~~~\n/.exec(src)
  if (!res) {
    return [src]
  }

  let remain = src.substring(res[0].length)

  let sep = remain.search(/\n~~~(\n|$)/)
  if (sep == -1) {
    sep = remain.length
  }
  const content = remain.substring(0, sep)
  remain = remain.substring(sep + 5)
  return [remain, new Raw(content)]
}

export const paragraphFilter: Filter = src => {
  if (!/^[^\n]/.test(src)) {
    return [src]
  }

  const sep = src.search('\n\n')
  const remain = src.substring(sep + 2)
  const content = src.substring(0, sep + 1)
  return [remain, new Paragraph(content)]
}

export const blankLineFilter: Filter = src => {
  if (!/^\n/.test(src)) {
    return [src]
  }

  const remain = src.substring(1)
  return [remain, new BlankLine()]
}
