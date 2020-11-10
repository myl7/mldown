import {parser} from './filters'
import {Transor} from './transors/types'

export default (src: string, transor: Transor): string => {
  const nodes = parser(src)
  return transor.exec(nodes)
}
