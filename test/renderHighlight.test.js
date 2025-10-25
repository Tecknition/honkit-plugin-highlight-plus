const test = require('node:test');
const assert = require('node:assert/strict');
const { renderHighlight } = require('../lib/renderHighlight');
const { registerLanguages } = require('../lib/registerLanguages');

let highlightAvailable = true;
let hljs;

try {
  hljs = require('highlight.js/lib/core');
  const javascript = require('highlight.js/lib/languages/javascript');
  hljs.registerLanguage('javascript', javascript);
} catch (err) {
  highlightAvailable = false;
}

const maybeSkip = highlightAvailable ? {} : { skip: true };

test('renders highlighted code with inline theme once', maybeSkip, () => {
  const content = '```javascript\nconsole.log(42);\n```';
  const result = renderHighlight(content, hljs, { theme: 'github-dark', lineNumbers: true });

  assert.ok(result.startsWith('<style data-highlight-plus-theme>'));
  assert.ok(result.includes('<td class="line-number">1</td>'));
  assert.ok(/hljs-[a-z-]+/.test(result), 'expected highlight.js classes in output');
});

test('registerLanguages loads non-core languages when available', maybeSkip, () => {
  const localHljs = require('highlight.js/lib/core');
  registerLanguages(localHljs, ['ini']);
  assert.ok(localHljs.getLanguage('ini'));
});

test('resolves language tokens from complex info strings', () => {
  const calls = [];
  const stub = {
    getLanguage(language) {
      calls.push(language);
      return true;
    },
    highlight(code) {
      return { value: code.trim() };
    },
  };

  const html = renderHighlight('```c++ {"label":"example"}\nint main(){}\n```', stub, { theme: 'github-dark' });
  assert.ok(html.includes('int main()'));
  assert.strictEqual(calls[0], 'c++');
});
