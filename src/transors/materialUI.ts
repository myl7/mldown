import {Transor} from './types'
import {BlankLine, CodeBlock, H1, H2, H3, H4, H5, H6, Paragraph, Raw, Tbreak} from '../ast/leafBlocks'
import {Olist, Quote, Ulist} from '../ast/cntrBlocks'
import {Autolink, CodeSpan, Del, Em, Img, Link, Plain, Strong} from '../ast/inlines'
import {trans} from './utils'
import {AstNode} from '../ast/types'

export class MaterialUITransor implements Transor {
  exec(nodes: AstNode[]): string {
    return nodes.map(n => trans(n, this)).join('')
  }

  tbreak(_node: Tbreak): string {
    return '<Divider />'
  }

  h1(node: H1): string {
    const title = node.title ? node.title.map(n => trans(n, this)).join('') : ''
    return `<Typography component="h1">${title}</Typography>`
  }

  h2(node: H2): string {
    const title = node.title ? node.title.map(n => trans(n, this)).join('') : ''
    return `<Typography component="h2">${title}</Typography>`
  }

  h3(node: H3): string {
    const title = node.title ? node.title.map(n => trans(n, this)).join('') : ''
    return `<Typography component="h3">${title}</Typography>`
  }

  h4(node: H4): string {
    const title = node.title ? node.title.map(n => trans(n, this)).join('') : ''
    return `<Typography component="h4">${title}</Typography>`
  }

  h5(node: H5): string {
    const title = node.title ? node.title.map(n => trans(n, this)).join('') : ''
    return `<Typography component="h5">${title}</Typography>`
  }

  h6(node: H6): string {
    const title = node.title ? node.title.map(n => trans(n, this)).join('') : ''
    return `<Typography component="h6">${title}</Typography>`
  }

  codeBlock(node: CodeBlock): string {
    const infoStr = node.infoStr ? `class="language-${node.infoStr}"` : ''
    const content = node.content.replace(/\n/g, '{\'\\n\'}')
    return `<pre><Box component="code" fontFamily="Source Code Pro" ${infoStr}>${content}</Box></pre>`
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
    return `<Box component="code" fontFamily="Source Code Pro">${node.children.map(n => trans(n, this))}</Box>`
  }

  em(node: Em): string {
    return `<Box fontStyle="italic">${node.children.map(n => trans(n, this))}</Box>`
  }

  strong(node: Strong): string {
    return `<Box fontWeight="fontWeightBold">${node.children.map(n => trans(n, this))}</Box>`
  }

  del(node: Del): string {
    return `<del>${node.children.map(n => trans(n, this))}</del>`
  }

  link(node: Link): string {
    const title = node.title ? ` title="${node.title}"` : ''
    return `<Link href="${node.url}" ${title}>${node.label}</Link>`
  }

  img(node: Img): string {
    const title = node.title ? ` title="${node.title}"` : ''
    return `<img src="${node.url}" alt="${node.alt}" ${title} />`
  }

  autolink(node: Autolink): string {
    return `<Link href="${node.content}">${node.content}</Link>`
  }

  plain(node: Plain): string {
    return node.content.replace(/\n/g, '{\'\\n\'}')
  }
}
