import {AstNode} from './types'

abstract class Paired {
  children: AstNode[]

  constructor(children: AstNode[]) {
    this.children = children
  }
}

export class CodeSpan extends Paired implements AstNode {
  type = 'codeSpan'
}

export class Em extends Paired implements AstNode {
  type = 'em'
}

export class Strong extends Paired implements AstNode {
  type = 'strong'
}

export class Del extends Paired implements AstNode {
  type = 'del'
}

export class Link implements AstNode {
  type = 'link'
  label: string
  url: string
  title?: string

  constructor(label: string, url: string, title?: string) {
    this.label = label
    this.url = url
    this.title = title
  }
}

export class Img implements AstNode {
  type = 'img'
  alt: string
  url: string
  title?: string

  constructor(alt: string, url: string, title?: string) {
    this.alt = alt
    this.url = url
    this.title = title
  }
}

export class Autolink implements AstNode {
  type = 'autolink'
  content: string

  constructor(content: string) {
    this.content = content
  }
}

export class Plain implements AstNode {
  type = 'plain'
  content: string

  constructor(content: string) {
    this.content = content
  }
}
