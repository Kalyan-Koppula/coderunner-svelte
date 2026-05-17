import { languageLoaders, normalizeLanguage, bodhakHighlightStyle } from '../common';

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