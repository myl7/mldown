import {filter} from './index'
import {BlankLine, CodeBlock, H1} from '../ast/leafBlocks'

describe('merged filter', () => {
  it('leaf only', () => {
    const [remain0, node0] = filter('# title0 and title1\n\n```c\nint main() {\n}\n```\n')
    expect(node0).toEqual(new H1('title0 and title1'))
    const [remain1, node1] = filter(remain0)
    expect(node1).toEqual(new BlankLine())
    const [remain2, node2] = filter(remain1)
    expect(node2).toEqual(new CodeBlock('int main() {\n}\n', 'c'))
    expect(remain2).toEqual('')
  })
})
