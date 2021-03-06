import {Filter} from './types'
import {AstNode} from '../ast/types'
import {Autolink, CodeSpan, Del, Em, Img, Link, Plain, Strong} from '../ast/inlines'
import {or} from './op'

const codeSpanFilter: Filter = src => {
  if (src[0] != '`') {
    return [src]
  }

  const res = /^`((?:[^`]|\\`)+?)`/.exec(src)
  if (!res) {
    return [src]
  }

  const remain = src.substring(res[0].length)
  const content = res[1]
  const children = inlineParser(content)
  return [remain, new CodeSpan(children)]
}

const emFilter: Filter = src => {
  if (src[0] != '*') {
    return [src]
  }

  const res = /^\*((?:[^*]|\\\*)+?)\*/.exec(src)
  if (!res) {
    return [src]
  }

  const remain = src.substring(res[0].length)
  const content = res[1]
  const children = inlineParser(content)
  return [remain, new Em(children)]
}

const strongFilter: Filter = src => {
  if (src.substring(0, 2) != '**') {
    return [src]
  }

  const res = /^\*\*((?:[^*]|\\\*)+?)\*\*/.exec(src)
  if (!res) {
    return [src]
  }

  const remain = src.substring(res[0].length)
  const content = res[1]
  const children = inlineParser(content)
  return [remain, new Strong(children)]
}

const delFilter: Filter = src => {
  if (src.substring(0, 2) != '~~') {
    return [src]
  }

  const res = /^~~((?:[^~]|\\~)+?)~~/.exec(src)
  if (!res) {
    return [src]
  }

  const remain = src.substring(res[0].length)
  const content = res[1]
  const children = inlineParser(content)
  return [remain, new Del(children)]
}

const linkLikeFilter = (startStr: string, builder: (label: string, url: string, title?: string) => AstNode): Filter => {
  return src => {
    if (src.substring(0, startStr.length) != startStr) {
      return [src]
    }
    let remain = src.substring(startStr.length)

    if (remain[0] != '[') {
      return [src]
    }

    let res = /^\[((?:[^\]]|\\])+?)]\(((?:[^)]|\\\))+?)\)/.exec(remain)
    if (!res) {
      return [src]
    }

    remain = remain.substring(res[0].length)
    const label = res[1].replace(/\\]/g, ']')
    const urlInfo = res[2].replace(/\\\)/g, ')')

    res = /^([^ ]+?) '((?:[^']|\\')*?)'$/.exec(urlInfo)
    if (!res) {
      res = /^([^ ]+?) "((?:[^"]|\\")*?)"$/.exec(urlInfo)
      if (!res) {
        res = /^([^ ]+?)$/.exec(urlInfo)
        if (!res) {
          return [src]
        }
      }
    }

    const url = res[1]
    let title = res[2]
    if (title) {
      title = title.replace(/\\'/g, '\'').replace(/\\"/g, '"')
    }
    return [remain, builder(label, url, title)]
  }
}

const linkFilter: Filter = linkLikeFilter('', (l, u, t) => new Link(l, u, t))
const imgFilter: Filter = linkLikeFilter('!', (l, u, t) => new Img(l, u, t))

const autolinkFilter: Filter = src => {
  if (src[0] != '<') {
    return [src]
  }

  let res = /^<([^>]+?)>/.exec(src)
  if (!res) {
    return [src]
  }
  const remain = src.substring(res[0].length)
  const content = res[1]
  return [remain, new Autolink(content)]
}

const inlineSpecialFilter: Filter = or(
  strongFilter, delFilter, codeSpanFilter, emFilter, linkFilter, imgFilter, autolinkFilter
)

export const inlineParser = (src: string): AstNode[] => {
  let nodes = []
  let text = ''
  let remain = src
  let node
  while (true) {
    if (!remain) {
      break
    }

    if (remain[0] == '\\') {
      text += remain[1]
      remain = remain.substring(2)
      continue
    }

    [remain, node] = inlineSpecialFilter(remain)
    if (node == undefined) {
      // Require escape.
      text += remain.substring(0, 1)
      remain = remain.substring(1)
    } else {
      if (text) {
        text = text.replace(/\\`/g, '`')
          .replace(/\\\*/g, '*')
          .replace(/\\~/g, '~')
        nodes.push(new Plain(text))
        text = ''
      }
      nodes.push(node)
    }
  }

  if (text) {
    nodes.push(new Plain(text))
  }

  return nodes
}
