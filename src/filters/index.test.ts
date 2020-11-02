import {filter} from './index'
import {BlankLine, CodeBlock, H1, H2, H3, H4, H5, H6, Tbreak, Raw, Paragraph} from '../ast/leafBlocks'

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
  it('all leaves', () => {
    const src = `\
# h1
## h2
### h3

#### h4


##### h5

######

---

---
---

\`\`\`
Plain
\`\`\`

\`\`\`c
Test
Test
\`\`\`

\`\`\`c info
HW
\`\`\`

~~~
<Div></Div>
raw content
~~~

test test  test est
hi h hi ddd
sd si l
ss
 super user
`
    const nodes = [
      new H1('h1'),
      new H2('h2'),
      new H3('h3'),
      new BlankLine(),
      new H4('h4'),
      new BlankLine(),
      new BlankLine(),
      new H5('h5'),
      new BlankLine(),
      new H6(),
      new BlankLine(),
      new Tbreak(),
      new BlankLine(),
      new Tbreak(),
      new Tbreak(),
      new BlankLine(),
      new CodeBlock('Plain\n'),
      new BlankLine(),
      new CodeBlock('Test\nTest\n', 'c'),
      new BlankLine(),
      new CodeBlock('HW\n', 'c info'),
      new BlankLine(),
      new Raw('<Div></Div>\nraw content\n'),
      new BlankLine(),
      new Paragraph('test test  test est\nhi h hi ddd\nsd si l\nss\n super user\n')
    ]

    let remain = src
    let node
    for (let i = 0; i < 25; i++) {
      [remain, node] = filter(remain)
      expect(node).toEqual(nodes[i])
    }
    expect(remain).toEqual('')
  })
})
