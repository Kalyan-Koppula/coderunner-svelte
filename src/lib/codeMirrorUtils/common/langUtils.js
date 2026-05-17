export const languageLoaders = {
  javascript: async () => {
    const { javascript } = await import('@codemirror/lang-javascript');
    return javascript({ jsx: true });
  },
  typescript: async () => {
    const { javascript } = await import('@codemirror/lang-javascript');
    return javascript({ jsx: true, typescript: true });
  },
  html: async () => {
    const { html } = await import('@codemirror/lang-html');
    return html();
  },
  css: async () => {
    const { css } = await import('@codemirror/lang-css');
    return css();
  },
  json: async () => {
    const { json } = await import('@codemirror/lang-json');
    return json();
  }
//   python: async () => {
//     const { python } = await import('@codemirror/lang-python');
//     return python();
//   },
//   svelte: async () => {
//     // Note: Svelte CodeMirror support typically comes from community packages 
//     // like @replit/codemirror-lang-svelte or similar integrations.
//     const { svelte } = await import('@replit/codemirror-lang-svelte');
//     return svelte();
//   }
};

/**
 * Helper to normalize language alias configurations
 */
export function normalizeLanguage(lang) {
  const lower = (lang || '').toLowerCase().trim();
  if (['js', 'jsx', 'javascript'].includes(lower)) return 'javascript';
  if (['ts', 'tsx', 'typescript'].includes(lower)) return 'typescript';
  if (languageLoaders[lower]) return lower;
  throw new Error(`${lang} is not supported yet!`);
}