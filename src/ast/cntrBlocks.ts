import {AstNode} from './types'

export class Quote implements AstNode {
  type = 'quote'
  children: AstNode[]

  constructor(children: AstNode[]) {
    this.children = children
  }
}

export class Ulist implements AstNode {
  type = 'ulist'
  items: (AstNode|string)[]

  constructor(items: (AstNode|string)[]) {
    this.items = items
  }
}

export class Olist implements AstNode {
  type = 'olist'
  items: (AstNode|string)[]
  start?: number

  constructor(items: (AstNode|string)[], start?: number) {
    this.items = items
    this.start = start
  }
}

// export class TaskList implements AstNode {}
