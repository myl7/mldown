import {or} from './op'
import {olistFilter, quoteFilter, ulistFilter} from './cntrBlocks'
import {blankLineFilter, codeBlockFilter, hFilter, paragraphFilter, rawFilter, tbreakFilter} from './leafBlocks'

export const filter = or(
  quoteFilter, ulistFilter, olistFilter, tbreakFilter, hFilter, codeBlockFilter, rawFilter, paragraphFilter,
  blankLineFilter
)
