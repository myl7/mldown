import {AstNode} from '../ast/types'
import {Transor} from './types'

export const trans = (node: AstNode, transor: Transor): string => {
  // @ts-ignore
  return transor[node.type](node)
}
