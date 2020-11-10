import {filter} from '.'
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
      new Raw('<Div></Div>\nraw content'),
      new BlankLine(),
      new Paragraph([
        new Plain('test test  test est\nhi h hi ddd\nsd si l\nss\n super user')
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
          new Plain('Hello')
        ]),
        new Paragraph([
          new Plain('I am fine.\nThank you.')
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
        new Plain('Hello')
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
        new CodeSpan([new Plain('say')]),
        new Plain(' he'),
        new Em([new Plain('something')]),
        new Strong([new Plain('about')]),
        new Del([new Plain('that')]),
        new Plain('.\n'),
        new CodeSpan([new Plain('no')]),
        new Plain(' not every one *'),
        new Em([new Plain('can')]),
        new Plain(' '),
        new Em([new Plain('do that')]),
        new Plain('\nI hope '),
        new Link('you', '/here', 'yes'),
        new Plain(' '),
        new Link('can', '/there', 'not'),
        new Plain('\n '),
        new Link('not bad', '/ee', '\''),
        new Plain(' and '),
        new Link('not]  yes', '/', '"'),
        new Plain('\n'),
        new Img('you', 'can', 'see'),
        new Plain(' me ? well '),
        new Link('that', '/test'),
        new Plain(' ok\nhere '),
        new Autolink('you'),
        new Plain(' will ![](need] '),
        new Img('it', '//')
      ]),
      new Paragraph([
        new Plain('Ok I am fine now')
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

  it('actual post', () => {
    const src = `\
## Problem

Today I am writting a Telegram bot.
I choose YAML to display the results for users.
The results are requested by \`requests\`, parsed by \`Beautiful Soup\`, and finally dumped by \`PyYAML\`, which is a common plan.
However, when testing, a strange error comes out:

\`\`\`
# Tons of traceback info, all from \`yaml/representer.py\`.
RecursionError: maximum recursion depth exceeded in __instancecheck__
\`\`\`

But the dumped Python dict is just simple, and you can easily copy it and dump it in a Python shell.

After a long time web searching, I finally realize what I have done.

## Beautiful Soup: \`NavigableString\`

Let us start from Beautiful Soup.
I find out that I have used \`tag.string\` to get the text node in HTML, and pass it to PyYAML to dump it to readable text.
Here is a point: **Beautiful Soup \`tag.string\` returns \`NavigableString\`, not Python builti-in \`str\`.**
The \`NavigableString\` carries a reference to the entire Beautiful Soup parse tree, and provides some extra methods that working on it.
The original documentation text from [here](https://www.crummy.com/software/BeautifulSoup/bs4/doc/#navigablestring) is:

> If you want to use a \`NavigableString\` outside of Beautiful Soup, you should call \`unicode()\` on it to turn it into a normal Python Unicode string.
> If you don’t, your string will carry around a reference to the entire Beautiful Soup parse tree, even when you’re done using Beautiful Soup.
> This is a big waste of memory.

So we should call \`str()\` to convert \`NavigableString\` to \`str\`.

## PyYAML: \`safe_dump\`
`
    const nodes = [
      new H2('Problem'),
      new BlankLine(),
      new Paragraph([
        new Plain('Today I am writting a Telegram bot.\n' +
          'I choose YAML to display the results for users.\n' +
          'The results are requested by '),
        new CodeSpan([new Plain('requests')]),
        new Plain(', parsed by '),
        new CodeSpan([new Plain('Beautiful Soup')]),
        new Plain(', and finally dumped by '),
        new CodeSpan([new Plain('PyYAML')]),
        new Plain(', which is a common plan.\n' +
          'However, when testing, a strange error comes out:')
      ]),
      new CodeBlock('# Tons of traceback info, all from `yaml/representer.py`.\n' +
        'RecursionError: maximum recursion depth exceeded in __instancecheck__\n'),
      new BlankLine(),
      new Paragraph([
        new Plain('But the dumped Python dict is just simple, ' +
          'and you can easily copy it and dump it in a Python shell.')
      ]),
      new Paragraph([
        new Plain('After a long time web searching, I finally realize what I have done.')
      ]),
      new H2('Beautiful Soup: `NavigableString`'),
      new BlankLine(),
      new Paragraph([
        new Plain('Let us start from Beautiful Soup.\n' +
          'I find out that I have used '),
        new CodeSpan([new Plain('tag.string')]),
        new Plain(' to get the text node in HTML, and pass it to PyYAML to dump it to readable text.\n' +
          'Here is a point: '),
        new Strong([
          new Plain('Beautiful Soup '),
          new CodeSpan([new Plain('tag.string')]),
          new Plain(' returns '),
          new CodeSpan([new Plain('NavigableString')]),
          new Plain(', not Python builti-in '),
          new CodeSpan([new Plain('str')]),
          new Plain('.')
        ]),
        new Plain('\nThe '),
        new CodeSpan([new Plain('NavigableString')]),
        new Plain(' carries a reference to the entire Beautiful Soup parse tree, ' +
          'and provides some extra methods that working on it.\n' +
          'The original documentation text from '),
        new Link('here', 'https://www.crummy.com/software/BeautifulSoup/bs4/doc/#navigablestring'),
        new Plain(' is:')
      ]),
      new Quote([
        new Paragraph([
          new Plain('If you want to use a '),
          new CodeSpan([new Plain('NavigableString')]),
          new Plain(' outside of Beautiful Soup, you should call '),
          new CodeSpan([new Plain('unicode()')]),
          new Plain(' on it to turn it into a normal Python Unicode string.\n' +
            'If you don’t, your string will carry around a reference to the entire Beautiful Soup parse tree, even when you’re done using Beautiful Soup.\n' +
            'This is a big waste of memory.')
        ])
      ]),
      new BlankLine(),
      new Paragraph([
        new Plain('So we should call '),
        new CodeSpan([new Plain('str()')]),
        new Plain(' to convert '),
        new CodeSpan([new Plain('NavigableString')]),
        new Plain(' to '),
        new CodeSpan([new Plain('str')]),
        new Plain('.')
      ]),
      new H2('PyYAML: `safe_dump`')
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
