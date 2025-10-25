function registerLanguages(hljs, languages) {
  if (!Array.isArray(languages)) return;

  languages.forEach((lang) => {
    const languageName = String(lang).trim();
    if (!languageName) return;

    try {
      if (hljs.getLanguage(languageName)) {
        console.log(`[highlight-plus] Using built-in: ${languageName}`);
        return;
      }

      const modulePath = require.resolve(`highlight.js/lib/languages/${languageName}.js`);
      const langDef = require(modulePath);
      hljs.registerLanguage(languageName, langDef);
      console.log(`[highlight-plus] Registered custom language: ${languageName}`);
    } catch (err) {
      console.warn(`[highlight-plus] Could not register language: ${languageName}`, err.message);
    }
  });
}

module.exports = { registerLanguages };
