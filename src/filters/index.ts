import {or} from './op'
import {cntrBlockFilter} from './cntrBlocks'
import {leafBlockFilter} from './leafBlocks'
import {AstNode} from '../ast/types'

export const filter = or(cntrBlockFilter, leafBlockFilter)

export const parser = (src: string): AstNode[] => {
  let remain = src
  let nodes = []
  while (remain) {
    const [newRemain, node] = filter(remain)
    remain = newRemain
    nodes.push(node!)
  }
  return nodes
}
