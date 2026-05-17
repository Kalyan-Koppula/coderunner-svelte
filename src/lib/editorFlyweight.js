// src/lib/editorFlyweight.js
import { bodhakHighlightStyle } from '$lib';

// Global cache for core framework and active language extensions
let coreModulesPromise = null;
const extensionCache = new Map();

/**
 * 1. Core Framework Loader: Loads only the structural CodeMirror modules once.
 */
async function loadCoreModules() {
  if (coreModulesPromise) return coreModulesPromise;

  coreModulesPromise = (async () => {
    const [ViewPkg, StatePkg, HighlightPkg] = await Promise.all([
      import('@codemirror/view'),
      import('@codemirror/state'),
      import('@codemirror/language')
    ]);

    return {
      EditorView: ViewPkg.EditorView,
      basicSetup: ViewPkg.basicSetup,
      EditorState: StatePkg.EditorState,
      syntaxHighlighting: HighlightPkg.syntaxHighlighting
    };
  })();

  return coreModulesPromise;
}

/**
 * 2. On-Demand Language Registry: Defines how to fetch each language package.
 * These imports only trigger over the network when the function execution is called.
 */
const languageLoaders = {
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
function normalizeLanguage(lang) {
  const lower = (lang || '').toLowerCase().trim();
  if (['js', 'jsx', 'javascript'].includes(lower)) return 'javascript';
  if (['ts', 'tsx', 'typescript'].includes(lower)) return 'typescript';
  if (languageLoaders[lower]) return lower;
  return 'javascript'; // Fallback default
}

/**
 * 3. Shared Extensions (The Flyweight Intrinsic State)
 * Resolves and caches both core styles and specific language servers on demand.
 */
async function getSharedExtensions(language) {
  const normLang = normalizeLanguage(language);

  // Return cached pipeline if this specific language was already built
  if (extensionCache.has(normLang)) {
    return extensionCache.get(normLang);
  }

  // Load core modules and the specific language pack concurrently
  const [core, langExtension] = await Promise.all([
    loadCoreModules(),
    languageLoaders[normLang]()
  ]);

  const extensions = [
    core.basicSetup,
    langExtension,
    core.syntaxHighlighting ? core.syntaxHighlighting(bodhakHighlightStyle) : null,
    core.EditorView.theme({
      "&": { height: "100%" },
      ".cm-content": { padding: 0, caretColor: "var(--code-cursor)" },
      ".cm-line": { padding: 0 },
    })
  ].filter(Boolean);

  // Store the generated pipeline configuration array in the flyweight cache Map
  extensionCache.set(normLang, extensions);
  return extensions;
}

/**
 * 4. Factory Hook: Assembles the isolated view instance using shared configurations.
 */
export async function mountFlyweightEditor(language, initialCode, container) {
  const [core, extensions] = await Promise.all([
    loadCoreModules(),
    getSharedExtensions(language)
  ]);

  const state = core.EditorState.create({
    doc: initialCode || "",
    extensions
  });

  const view = new core.EditorView({
    state,
    parent: container
  });

  return view;
}