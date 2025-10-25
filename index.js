const hljs = require("highlight.js");
const { registerLanguages } = require("./lib/registerLanguages");
const { renderHighlight } = require("./lib/renderHighlight");

module.exports = {
  book: {
    assets: "./assets",
    css: ["highlight-plus.css"],
  },
  hooks: {
    "init": async function () {
      const config = this.config.get("pluginsConfig.highlight-plus") || {};
      registerLanguages(hljs, config.languages || []);
    },

    "page:before": async function (page) {
      const config = this.config.get("pluginsConfig.highlight-plus") || {};
      const theme = config.theme || "github-dark";
      const lineNumbers = config.lineNumbers !== false;

      page.content = renderHighlight(page.content, hljs, { theme, lineNumbers });
      return page;
    },
  }
};
