import mldown from '.'
import HtmlTransor from './transors/html'
import {MaterialUITransor} from './transors/materialUI'

describe('html transor parser', () => {
  it('html transor simple', () => {
    const src = '# Test\n\n```c\nint main() {\n  return 0;\n}\n```\n\nTest\n'
    const html = '<h1>Test</h1><pre><code class="language-c">int main() {\n  return 0;\n}\n</code></pre><p>Test</p>'

    expect(mldown(src, new HtmlTransor())).toEqual(html)
  })

  it('html transor actual post', () => {
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

As for PyYAML, [the documentation](https://pyyaml.org/wiki/PyYAMLDocumentation) is not good.
As we (may) know YAML can work on complicated Python objects, and the libraries usually provides an additional set of safe functions, which avoids this.
PyYAML safe dump function can be found [here](https://pyyaml.org/wiki/PyYAMLDocumentation#reference) and [here](https://pyyaml.org/wiki/PyYAMLDocumentation#dumper), which are at the nearly bottom, and not shown in the quick start.
Here is a useful text:

> \`SafeDumper(stream)\` produces only standard YAML tags and thus cannot represent class instances and probably more compatible with other YAML processors.
> The functions \`safe_dump\` and \`safe_dump_all\` use \`SafeDumper\` to produce a YAML document.

(Additionally, use \`CDumper\` to get a lot better preformance.)
I found I have used \`yaml.dump()\`, so the PyYAML try to dump the \`NavigableString\`, and as it contains a reference to the entire Beautiful Soup parse tree, and I have used \`tag.string\` many times, the PyYAML is trying to dump the entire tree many times!
Easy to guess it reaches the recusive depth limit, which is 1000 without editing.

After fixing the above mistakes, Everything works fine.

## Additionally

To get current recusive depth and the limit of it, and mute the very very long recusive error traceback info, I have searched the web, finding them on Stack Overflow.
Here are them:

\`\`\`python
# Limit traceback depth.
import sys
sys.tracebacklimit = 1
# Get the recusive depth limit.
sys.getrecursionlimit()
# Set it, default 1000 usually.
sys.getrecursionlimit(1000)
# Get current recusive depth.
import inspect
len(inspect.stack())
\`\`\`
`
    const html = `\
<h2>Problem</h2>\
<p>\
Today I am writting a Telegram bot. \
I choose YAML to display the results for users. \
The results are requested by <code>requests</code>, parsed by <code>Beautiful Soup</code>, and finally dumped by <code>PyYAML</code>, which is a common plan. \
However, when testing, a strange error comes out:\
</p>\
<pre><code>\
# Tons of traceback info, all from \`yaml/representer.py\`.
RecursionError: maximum recursion depth exceeded in __instancecheck__
</code></pre>\
<p>But the dumped Python dict is just simple, and you can easily copy it and dump it in a Python shell.</p>\
<p>After a long time web searching, I finally realize what I have done.</p>\
<h2>Beautiful Soup: \`NavigableString\`</h2>\
<p>\
Let us start from Beautiful Soup. \
I find out that I have used <code>tag.string</code> to get the text node in HTML, and pass it to PyYAML to dump it to readable text. \
Here is a point: <strong>Beautiful Soup <code>tag.string</code> returns <code>NavigableString</code>, not Python builti-in <code>str</code>.</strong> \
The <code>NavigableString</code> carries a reference to the entire Beautiful Soup parse tree, and provides some extra methods that working on it. \
The original documentation text from <a href="https://www.crummy.com/software/BeautifulSoup/bs4/doc/#navigablestring">here</a> is:\
</p>\
<blockquote>\
<p>\
If you want to use a <code>NavigableString</code> outside of Beautiful Soup, you should call <code>unicode()</code> on it to turn it into a normal Python Unicode string. \
If you don’t, your string will carry around a reference to the entire Beautiful Soup parse tree, even when you’re done using Beautiful Soup. \
This is a big waste of memory.\
</p>\
</blockquote>\
<p>So we should call <code>str()</code> to convert <code>NavigableString</code> to <code>str</code>.</p>\
<h2>PyYAML: \`safe_dump\`</h2>\
<p>\
As for PyYAML, <a href="https://pyyaml.org/wiki/PyYAMLDocumentation">the documentation</a> is not good. \
As we (may) know YAML can work on complicated Python objects, and the libraries usually provides an additional set of safe functions, which avoids this. \
PyYAML safe dump function can be found <a href="https://pyyaml.org/wiki/PyYAMLDocumentation#reference">here</a> and <a href="https://pyyaml.org/wiki/PyYAMLDocumentation#dumper">here</a>, which are at the nearly bottom, and not shown in the quick start. \
Here is a useful text:\
</p>\
<blockquote>\
<p>\
<code>SafeDumper(stream)</code> produces only standard YAML tags and thus cannot represent class instances and probably more compatible with other YAML processors. \
The functions <code>safe_dump</code> and <code>safe_dump_all</code> use <code>SafeDumper</code> to produce a YAML document.\
</p>\
</blockquote>\
<p>\
(Additionally, use <code>CDumper</code> to get a lot better preformance.) \
I found I have used <code>yaml.dump()</code>, so the PyYAML try to dump the <code>NavigableString</code>, and as it contains a reference to the entire Beautiful Soup parse tree, and I have used <code>tag.string</code> many times, the PyYAML is trying to dump the entire tree many times! \
Easy to guess it reaches the recusive depth limit, which is 1000 without editing.\
</p>\
<p>After fixing the above mistakes, Everything works fine.</p>\
<h2>Additionally</h2>\
<p>\
To get current recusive depth and the limit of it, and mute the very very long recusive error traceback info, I have searched the web, finding them on Stack Overflow. \
Here are them:\
</p>\
<pre><code class="language-python">\
# Limit traceback depth.
import sys
sys.tracebacklimit = 1
# Get the recusive depth limit.
sys.getrecursionlimit()
# Set it, default 1000 usually.
sys.getrecursionlimit(1000)
# Get current recusive depth.
import inspect
len(inspect.stack())
</code></pre>\
`

    expect(mldown(src, new HtmlTransor())).toEqual(html)
  })
})

describe('material ui transor parser', () => {
  it('material ui transor actual post', () => {
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

As for PyYAML, [the documentation](https://pyyaml.org/wiki/PyYAMLDocumentation) is not good.
As we (may) know YAML can work on complicated Python objects, and the libraries usually provides an additional set of safe functions, which avoids this.
PyYAML safe dump function can be found [here](https://pyyaml.org/wiki/PyYAMLDocumentation#reference) and [here](https://pyyaml.org/wiki/PyYAMLDocumentation#dumper), which are at the nearly bottom, and not shown in the quick start.
Here is a useful text:

> \`SafeDumper(stream)\` produces only standard YAML tags and thus cannot represent class instances and probably more compatible with other YAML processors.
> The functions \`safe_dump\` and \`safe_dump_all\` use \`SafeDumper\` to produce a YAML document.

(Additionally, use \`CDumper\` to get a lot better preformance.)
I found I have used \`yaml.dump()\`, so the PyYAML try to dump the \`NavigableString\`, and as it contains a reference to the entire Beautiful Soup parse tree, and I have used \`tag.string\` many times, the PyYAML is trying to dump the entire tree many times!
Easy to guess it reaches the recusive depth limit, which is 1000 without editing.

After fixing the above mistakes, Everything works fine.

## Additionally

To get current recusive depth and the limit of it, and mute the very very long recusive error traceback info, I have searched the web, finding them on Stack Overflow.
Here are them:

\`\`\`python
# Limit traceback depth.
import sys
sys.tracebacklimit = 1
# Get the recusive depth limit.
sys.getrecursionlimit()
# Set it, default 1000 usually.
sys.getrecursionlimit(1000)
# Get current recusive depth.
import inspect
len(inspect.stack())
\`\`\`
`
    const emit = mldown(src, new MaterialUITransor())
    // console.log(emit)
  })
})
