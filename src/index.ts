import {parser} from './filters/index'
import {Transor} from './transors/types'

export default (src: string, transor: Transor): string => {
  const nodes = parser(src)
  return transor.exec(nodes)
}
