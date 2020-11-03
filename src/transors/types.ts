import {Tbreak, H1, H2, H3, H4, H5, H6, CodeBlock, Raw, Paragraph, BlankLine} from '../ast/leafBlocks'
import {Olist, Quote, Ulist} from '../ast/cntrBlocks'
import {Autolink, CodeSpan, Del, Em, Img, Link, Plain, Strong} from '../ast/inlines'
import {AstNode} from '../ast/types'

export interface Transor {
  exec: (nodes: AstNode[]) => string
  tbreak: (node: Tbreak) => string
  h1: (node: H1) => string
  h2: (node: H2) => string
  h3: (node: H3) => string
  h4: (node: H4) => string
  h5: (node: H5) => string
  h6: (node: H6) => string
  codeBlock: (node: CodeBlock) => string
  raw: (node: Raw) => string
  paragraph: (node: Paragraph) => string
  blankLine: (node: BlankLine) => string
  quote: (node: Quote) => string
  ulist: (node: Ulist) => string
  olist: (node: Olist) => string
  codeSpan: (node: CodeSpan) => string
  em: (node: Em) => string
  strong: (node: Strong) => string
  del: (node: Del) => string
  link: (node: Link) => string
  img: (node: Img) => string
  autolink: (node: Autolink) => string
  plain: (node: Plain) => string
}
