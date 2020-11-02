import {AstNode} from '../ast/types'

export type Filter = (src: string) => [string, AstNode?]
