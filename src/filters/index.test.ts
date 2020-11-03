import {filter} from './index'
import {BlankLine, CodeBlock, H1, H2, H3, H4, H5, H6, Tbreak, Raw, Paragraph} from '../ast/leafBlocks'
import {Olist, Quote, Ulist} from '../ast/cntrBlocks'
import {Autolink, CodeSpan, Del, Em, Img, Link, Plain, Strong} from '../ast/inlines'

describe('merged filter', () => {
  it('some leaf blocks', () => {
    const [remain0, node0] = filter('# title0 and title1\n\n```c\nint main() {\n}\n```\n')
    expect(node0).toEqual(new H1('title0 and title1'))
    const [remain1, node1] = filter(remain0)
    expect(node1).toEqual(new BlankLine())
    const [remain2, node2] = filter(remain1)
    expect(node2).toEqual(new CodeBlock('int main() {\n}\n', 'c'))
    expect(remain2).toEqual('')
  })

  it('all leaf blocks', () => {
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
      new Paragraph([
        new Plain('test test  test est\nhi h hi ddd\nsd si l\nss\n super user\n')
      ])
    ]

    let remain = src
    let node
    for (let i = 0; i < nodes.length; i++) {
      [remain, node] = filter(remain)
      expect(node).toEqual(nodes[i])
    }
    expect(remain).toEqual('')
  })

  it('some quote cntr blocks', () => {
    const src = '> Hello\n>\n> I am fine.\n> Thank you.\n>\n\n# h1 come out\n'
    const nodes = [
      new Quote([
        new Paragraph([
          new Plain('Hello\n')
        ]),
        new Paragraph([
          new Plain('I am fine.\nThank you.\n')
        ])
      ]),
      new BlankLine(),
      new H1('h1 come out')
    ]

    let remain = src
    let node
    for (let i = 0; i < nodes.length; i++) {
      [remain, node] = filter(remain)
      expect(node).toEqual(nodes[i])
    }
    expect(remain).toEqual('')
  })

  it('some list cntr blocks', () => {
    const src = '- a\n- b\n-\n```c\nWell\nI can do it\n```\n- d\n\nHello\n\n3.\n# A title\n2. b\n4. ok ok\n9. well\n'
    const nodes = [
      new Ulist([
        'a',
        'b',
        new CodeBlock('Well\nI can do it\n', 'c'),
        'd'
      ]),
      new BlankLine(),
      new Paragraph([
        new Plain('Hello\n')
      ]),
      new Olist([
        new H1('A title'),
        'b',
        'ok ok',
        'well'
      ], 3)
    ]

    let remain = src
    let node
    for (let i = 0; i < nodes.length; i++) {
      [remain, node] = filter(remain)
      expect(node).toEqual(nodes[i])
    }
    expect(remain).toEqual('')
  })

  it('all paragraph inlines', () => {
    const src = `\
test this is a paragraph
I want to \`say\` he*something***about**~~that~~.
\`no\` not every one **can* *do that*
I hope [you](/here "yes") [can](/there 'not')
 [not bad](/ee '\\'') and [not\\]  yes](/ "\\"")
![you](can "see") me ? well [that](/test) ok
here <you> will ![](need] ![it](//)

Ok I am fine now
`
    const nodes = [
      new Paragraph([
        new Plain('test this is a paragraph\nI want to '),
        new CodeSpan('say'),
        new Plain(' he'),
        new Em('something'),
        new Strong('about'),
        new Del('that'),
        new Plain('.\n'),
        new CodeSpan('no'),
        new Plain(' not every one '),
        new Em('*can'),
        new Plain(' '),
        new Em('do that'),
        new Plain('\nI hope '),
        new Link('you', '/here', 'yes'),
        new Plain(' '),
        new Link('can', '/there', 'not'),
        new Plain('\n '),
        new Link('not bad', '/ee', '\\\''),
        new Plain(' and '),
        new Link('not\\]  yes', '/', '\\"'),
        new Plain('\n'),
        new Img('you', 'can', 'see'),
        new Plain(' me ? well '),
        new Link('that', '/test'),
        new Plain(' ok\nhere '),
        new Autolink('you'),
        new Plain(' will ![](need] '),
        new Img('it', '//'),
        new Plain('\n')
      ]),
      new Paragraph([
        new Plain('Ok I am fine now\n')
      ])
    ]

    let remain = src
    let node
    for (let i = 0; i < nodes.length; i++) {
      [remain, node] = filter(remain)
      expect(node).toEqual(nodes[i])
    }
    expect(remain).toEqual('')
  })
})