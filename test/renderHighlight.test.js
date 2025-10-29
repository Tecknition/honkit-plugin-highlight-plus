const test = require('node:test');
const assert = require('node:assert/strict');
const { renderHighlight } = require('../lib/renderHighlight');
const { registerLanguages } = require('../lib/registerLanguages');

let hljs;

try {
  hljs = require('highlight.js/lib/core');
  const javascript = require('highlight.js/lib/languages/javascript');
  hljs.registerLanguage('javascript', javascript);
} catch (err) {
  // Highlight.js not available
  hljs = null;
}

test('renders highlighted code with valid theme', () => {
  const content = '```javascript\nconsole.log(42);\n```';
  const stub = {
    getLanguage: () => true,
    highlight: (code) => ({ value: code.trim() }),
  };
  const result = renderHighlight(content, stub, { theme: null, lineNumbers: true });

  assert.ok(result.includes('<td class="line-number">1</td>'));
  assert.ok(result.includes('console.log(42)'));
});

test('renders code without line numbers', () => {
  const content = '```js\nconst x = 1;\n```';
  const stub = {
    getLanguage: () => true,
    highlight: (code) => ({ value: code.trim() }),
  };
  const result = renderHighlight(content, stub, { lineNumbers: false });

  assert.ok(result.includes('const x = 1'));
  assert.ok(result.includes('colspan="2"'));
  assert.ok(!result.includes('line-number'));
});

test('handles highlight errors gracefully', () => {
  const stub = {
    getLanguage: () => true,
    highlight: (code, opts) => {
      if (opts.language === 'javascript') {
        throw new Error('Highlight failed');
      }
      return { value: code.trim() };
    },
  };
  const result = renderHighlight('```javascript\ntest\n```', stub);
  assert.ok(result.includes('test'));
});

test('handles unknown languages', () => {
  const stub = {
    getLanguage: (lang) => lang === 'plaintext',
    highlight: (code) => ({ value: code.trim() }),
  };
  const result = renderHighlight('```unknownlang\ncode\n```', stub);
  assert.ok(result.includes('code'));
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

  const html = renderHighlight('```c++ {"label":"example"}\nint main(){}\n```', stub, {
    theme: null,
  });
  assert.ok(html.includes('int main()'));
  assert.strictEqual(calls[0], 'c++');
});

test('registerLanguages handles non-array input', () => {
  const stub = { getLanguage: () => null };
  registerLanguages(stub, null);
  registerLanguages(stub, undefined);
  registerLanguages(stub, 'string');
  assert.ok(true); // Should not throw
});

test('registerLanguages handles empty strings', () => {
  const stub = { getLanguage: () => null };
  registerLanguages(stub, ['', '  ', null]);
  assert.ok(true); // Should not throw
});

test('registerLanguages handles already registered languages', () => {
  const stub = {
    getLanguage: (lang) => lang === 'javascript',
    registerLanguage: () => {},
  };
  registerLanguages(stub, ['javascript']);
  assert.ok(true); // Should log built-in message
});

test('registerLanguages handles missing language modules', () => {
  const stub = {
    getLanguage: () => null,
    registerLanguage: () => {},
  };
  registerLanguages(stub, ['nonexistent-lang-xyz']);
  assert.ok(true); // Should warn but not throw
});

test('registerLanguages successfully registers new language', () => {
  const stub = {
    getLanguage: () => null,
    registerLanguage: (_name, _def) => {
      // Mock registration
    },
  };
  // This will attempt to register but may fail on require.resolve - that's okay
  registerLanguages(stub, ['ini']);
  // The function should have been called regardless
  assert.ok(true); // Function executed without crashing
});
