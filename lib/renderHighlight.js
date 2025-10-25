const fs = require("fs");

const themeCache = new Map();

function loadThemeCss(theme) {
  if (!theme) return "";
  if (themeCache.has(theme)) return themeCache.get(theme);

  try {
    const themePath = require.resolve(`highlight.js/styles/${theme}.css`);
    const css = fs.readFileSync(themePath, "utf8");
    themeCache.set(theme, css);
    return css;
  } catch (err) {
    console.warn(`[highlight-plus] Unable to load theme '${theme}':`, err.message);
    themeCache.set(theme, "");
    return "";
  }
}

function normalizeLanguage(infoString = "", hljs) {
  const token = String(infoString).trim().split(/[\s{]/)[0];
  const candidate = token.toLowerCase();
  return candidate && hljs.getLanguage(candidate) ? candidate : "plaintext";
}

function highlightSnippet(code, language, hljs) {
  const source = code.trim();
  try {
    return hljs.highlight(source, { language }).value;
  } catch (err) {
    console.warn(`[highlight-plus] Highlight failed for '${language}':`, err.message);
    return hljs.highlight(source, { language: "plaintext" }).value;
  }
}

function renderHighlight(content, hljs, options = {}) {
  const { theme = "github-dark", lineNumbers = true } = options;
  const themeCss = loadThemeCss(theme);
  let injectedTheme = false;

  const replaced = content.replace(/```([^\n]*)\n([\s\S]*?)```/g, (match, infoString, rawCode) => {
    const language = normalizeLanguage(infoString, hljs);
    const highlighted = highlightSnippet(rawCode, language, hljs);
    injectedTheme = true;

    const lines = highlighted.split("\n");
    const tableRows = lineNumbers
      ? lines
          .map((line, index) => `<tr><td class="line-number">${index + 1}</td><td class="code-line">${line}</td></tr>`)
          .join("\n")
      : `<tr><td class="code-line" colspan="2">${highlighted}</td></tr>`;

    return `
<div class="hk-highlight-plus">
  <table class="highlight-table">
    <tbody>
${tableRows}
    </tbody>
  </table>
</div>
`;
  });

  const styleTag = injectedTheme && themeCss
    ? `<style data-highlight-plus-theme>${themeCss}</style>`
    : "";

  return styleTag + replaced;
}

module.exports = { renderHighlight };
