import {parser} from './filters'
import {Transor} from './transors/types'
import {MaterialUITransor} from './transors/materialUI'

export default (src: string, transor?: Transor): string => {
  const nodes = parser(src)
  transor = transor ? transor : new MaterialUITransor()
  return transor.exec(nodes)
}
