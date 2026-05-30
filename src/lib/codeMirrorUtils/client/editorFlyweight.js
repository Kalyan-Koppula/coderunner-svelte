import { languageLoaders, normalizeLanguage, bodhakHighlightStyle } from '../common';

// Global cache for core framework and active language extensions
let coreModulesPromise = null;
const extensionCache = new Map();

/**
 * 1. Core Framework Loader: Loads structural framework blocks and advanced editing extensions.
 */
async function loadCoreModules() {
  if (coreModulesPromise) return coreModulesPromise;

  coreModulesPromise = (async () => {
    const [ViewPkg, StatePkg, HighlightPkg, CommandsPkg, AutocompletePkg, FoldPkg] = await Promise.all([
      import('@codemirror/view'),
      import('@codemirror/state'),
      import('@codemirror/language'),
      import('@codemirror/commands'),
      import('@codemirror/autocomplete'),
      import('@codemirror/language') // Fold management lives in language package too
    ]);

    return {
      EditorView: ViewPkg.EditorView,
      basicSetup: ViewPkg.basicSetup,
      EditorState: StatePkg.EditorState,
      syntaxHighlighting: HighlightPkg.syntaxHighlighting,
      
      // Visual Elements & Gutters
      lineNumbers: ViewPkg.lineNumbers,
      keymap: ViewPkg.keymap,
      drawSelection: ViewPkg.drawSelection,
      
      // Code Folding structures
      foldGutter: FoldPkg.foldGutter,
      foldKeymap: FoldPkg.foldKeymap,
      
      // Heavy Editing Interceptors
      closeBrackets: AutocompletePkg.closeBrackets,
      closeBracketsKeymap: AutocompletePkg.closeBracketsKeymap,
      
      // Core Key Bindings (VS Code mappings)
      indentWithTab: CommandsPkg.indentWithTab,
      standardKeymap: CommandsPkg.standardKeymap,
      historyKeymap: CommandsPkg.historyKeymap,
      moveLineUp: CommandsPkg.moveLineUp,
      moveLineDown: CommandsPkg.moveLineDown,
      copyLineUp: CommandsPkg.copyLineUp,
      copyLineDown: CommandsPkg.copyLineDown,
      history: CommandsPkg.history,
      historyKeymap: CommandsPkg.historyKeymap,
    };
  })();

  return coreModulesPromise;
}

/**
 * 2. Shared Extensions (The Flyweight Intrinsic State)
 * Assembles the customized text engine behaviors into shared cached arrays.
 */
async function getSharedExtensions(language) {
  const normLang = normalizeLanguage(language);

  if (extensionCache.has(normLang)) {
    return extensionCache.get(normLang);
  }

  const [core, langExtension] = await Promise.all([
    loadCoreModules(),
    languageLoaders[normLang]()
  ]);

  // Define tailored VS Code shortcuts manually for strict multi-OS handling
  const vscodeBehaviorKeymap = [
    { key: "Alt-ArrowUp", run: core.moveLineUp },
    { key: "Alt-ArrowDown", run: core.moveLineDown },
    { key: "Shift-Alt-ArrowUp", run: core.copyLineUp },
    { key: "Shift-Alt-ArrowDown", run: core.copyLineDown },
  ];

  const extensions = [
    // Base code highlighting engine
    langExtension,
    core.syntaxHighlighting ? core.syntaxHighlighting(bodhakHighlightStyle) : null,
    
    // Core functional settings
    core.drawSelection(),
    core.closeBrackets(),
    core.history(),
    
    // Default gutter layout for line numbers and folding
    core.lineNumbers(),
    core.foldGutter({
      markerDOM: (open) => {
        const icon = document.createElement("span");
        icon.className = `cm-fold-marker ${open ? "is-open" : "is-closed"}`;
        return icon;
      }
    }),

    // Pipeline Keyboard Event Interceptors
    core.keymap.of([
      core.indentWithTab, // Enables structural Tab block indenting
      ...vscodeBehaviorKeymap, // Injects Alt/Option line manipulation mechanics
      ...core.standardKeymap,
      ...core.historyKeymap,
      ...core.closeBracketsKeymap,
      ...core.foldKeymap
    ]),

    // Editor Polish and Aesthetic Theme Layouts
    core.EditorView.theme({
      "&": { 
        height: "100%",
        outline: "none"
      },
      ".cm-content": { 
        padding: "0px",
        caretColor: "var(--code-cursor, #ffffff)",
        fontFamily: "inherit"
      },
      ".cm-line": { 
        padding: "0 8px"
      },
      "&.cm-focused .cm-cursor": { 
        borderLeft: "2px solid var(--code-cursor, #ffffff) !important" 
      },
      
      // Selection overrides 
      "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "var(--code-selection-background) !important"
      },

      // Minimal theme layout, leaving gutter and fold UI to CodeMirror defaults
      ".cm-gutters": {
        backgroundColor: "transparent"
      }
    }, { dark: true })
  ].filter(Boolean);

  extensionCache.set(normLang, extensions);
  return extensions;
}

/**
 * 3. Factory Hook: Builds individual editor state with embedded VS Code features.
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