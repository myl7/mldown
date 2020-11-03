import {Filter} from './types'
import {AstNode} from '../ast/types'
import {Autolink, CodeSpan, Del, Em, Img, Link, Plain, Strong} from '../ast/inlines'
import {or} from './op'

const pairFilterBuilder = (marker: string, builder: (content: string) => AstNode): Filter => {
  return src => {
    if (src[0] != marker[marker.length - 1]) {
      return [src]
    }

    const res = new RegExp(`^${marker}((?:[^\`]|\\\\${marker})+?)${marker}`).exec(src)
    if (!res) {
      return [src]
    }
    const remain = src.substring(res[0].length)
    const content = res[1]
    return [remain, builder(content)]
  }
}

const codeSpanFilter: Filter = pairFilterBuilder('`', c => new CodeSpan(c))
const emFilter: Filter = pairFilterBuilder('\\*', c => new Em(c))
const strongFilter: Filter = pairFilterBuilder('\\*\\*', c => new Strong(c))
const delFilter: Filter = pairFilterBuilder('~~', c => new Del(c))

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
    const label = res[1]
    const urlInfo = res[2]

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
    const title = res[2]
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

    [remain, node] = inlineSpecialFilter(remain)
    if (node == undefined) {
      // Require escape.
      text += remain.substring(0, 1)
      remain = remain.substring(1)
    } else {
      if (text) {
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
