import {Transor} from './types'
import {BlankLine, CodeBlock, H1, H2, H3, H4, H5, H6, Paragraph, Raw, Tbreak} from '../ast/leafBlocks'
import {Olist, Quote, Ulist} from '../ast/cntrBlocks'
import {Autolink, CodeSpan, Del, Em, Img, Link, Plain, Strong} from '../ast/inlines'
import {trans} from './utils'
import {AstNode} from '../ast/types'

export default class HtmlTransor implements Transor {
  exec(nodes: AstNode[]): string {
    return nodes.map(n => trans(n, this)).join('')
  }

  tbreak(_node: Tbreak): string {
    return '<hr />'
  }

  h1(node: H1): string {
    return `<h1>${node.title}</h1>`
  }

  h2(node: H2): string {
    return `<h2>${node.title}</h2>`
  }

  h3(node: H3): string {
    return `<h3>${node.title}</h3>`
  }

  h4(node: H4): string {
    return `<h4>${node.title}</h4>`
  }

  h5(node: H5): string {
    return `<h5>${node.title}</h5>`
  }

  h6(node: H6): string {
    return `<h6>${node.title}</h6>`
  }

  codeBlock(node: CodeBlock): string {
    const infoStr = node.infoStr ? `class="language-${node.infoStr}"` : ''
    return `<pre><code ${infoStr}>${node.content}</code></pre>`
  }

  raw(node: Raw): string {
    return node.content
  }

  paragraph(node: Paragraph): string {
    return `<p>${node.children.map(n => trans(n, this)).join('')}</p>`
  }

  blankLine(_node: BlankLine): string {
    return ''
  }

  quote(node: Quote): string {
    return `<blockquote>${node.children.map(n => trans(n, this)).join('')}</blockquote>`
  }

  ulist(node: Ulist): string {
    const itemBuilder = (n: AstNode|string) => typeof n == 'string' ? n : trans(n, this)
    return `<ul>${node.items.map(n => `<li>${itemBuilder(n)}</li>`).join('')}</ul>`
  }

  olist(node: Olist): string {
    const itemBuilder = (n: AstNode|string) => typeof n == 'string' ? n : trans(n, this)
    const start = node.start ? ` start="${node.start}"` : ''
    return `<ol ${start}>${node.items.map(n => `<li>${itemBuilder(n)}</li>`).join('')}</ol>`
  }

  codeSpan(node: CodeSpan): string {
    return `<code>${node.children.map(n => trans(n, this)).join('')}</code>`
  }

  em(node: Em): string {
    return `<em>${node.children.map(n => trans(n, this)).join('')}</em>`
  }

  strong(node: Strong): string {
    return `<strong>${node.children.map(n => trans(n, this)).join('')}</strong>`
  }

  del(node: Del): string {
    return `<del>${node.children.map(n => trans(n, this)).join('')}</del>`
  }

  link(node: Link): string {
    const title = node.title ? ` title="${node.title}"` : ''
    return `<a href="${node.url}" ${title}>${node.label}</a>`
  }

  img(node: Img): string {
    const title = node.title ? ` title="${node.title}"` : ''
    return `<img src="${node.url}" alt="${node.alt}" ${title} />`
  }

  autolink(node: Autolink): string {
    return `<a href="${node.content}">${node.content}</a>`
  }

  plain(node: Plain): string {
    return node.content.replace(/\n/g, ' ')
  }
}
