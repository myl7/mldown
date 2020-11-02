import {AstNode} from './types'

export class Tbreak implements AstNode {
  type = 'tbreak'
}

abstract class Head {
  title?: string

  constructor(title?: string) {
    this.title = title
  }
}

export class H1 extends Head implements AstNode {
  type = 'h1'
}

export class H2 extends Head implements AstNode {
  type = 'h2'
}

export class H3 extends Head implements AstNode {
  type = 'h3'
}

export class H4 extends Head implements AstNode {
  type = 'h4'
}

export class H5 extends Head implements AstNode {
  type = 'h5'
}

export class H6 extends Head implements AstNode {
  type = 'h6'
}

export class CodeBlock implements AstNode {
  type = 'codeBlock'
  content: string
  infoStr?: string

  constructor(content: string, infoStr?: string) {
    this.content = content
    this.infoStr = infoStr
  }
}

export class Raw implements AstNode {
  type = 'raw'
  content: string

  constructor(content: string) {
    this.content = content
  }
}

export class Paragraph implements AstNode {
  type = 'paragraph'
  content: string

  constructor(content: string) {
    this.content = content
  }
}

export class BlankLine implements AstNode {
  type = 'blankLine'
}

// export class Table implements AstNode {}
