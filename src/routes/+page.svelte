<script>
  import { onMount } from 'svelte';
  
  let { data } = $props();
  let container = $state(null);
  let view = $state(null);

  async function initEditor() {
    if (view || !container) return;

    try {
      // 1. Import modules individually to see exactly what is failing
      const ViewPkg = await import('@codemirror/view');
      const StatePkg = await import('@codemirror/state');
      const LangPkg = await import('@codemirror/lang-javascript');
      const HighlightPkg = await import('@codemirror/language');
      const LezerPkg = await import('@lezer/highlight');

      // 2. Destructure with fallbacks to avoid "undefined" errors
      const { EditorView, basicSetup } = ViewPkg;
      const { EditorState } = StatePkg;
      const { javascript } = LangPkg;
      const { syntaxHighlighting, HighlightStyle } = HighlightPkg;
      const { tags: t } = LezerPkg;

      // 3. Define the style mapping (Manual ensures stability)
      const bodhakHighlightStyle = HighlightStyle.define([
        { tag: t.keyword, class: "tok-keyword" },
        { tag: t.variableName, class: "tok-variableName" },
        { tag: t.propertyName, class: "tok-propertyName" },
        { tag: t.tagName, class: "tok-tagName" },
        { tag: t.attributeName, class: "tok-attributeName" },
        { tag: t.angleBracket, class: "tok-angleBracket" },
        { tag: t.string, class: "tok-string" },
        { tag: t.punctuation, class: "tok-punctuation" },
        { tag: t.operator, class: "tok-operator" },
        { tag: t.comment, class: "tok-comment" }
      ]);

      // 4. Build the extension list and filter out any accidental undefineds
      const extensions = [
        basicSetup,
        javascript({ jsx: true }),
        syntaxHighlighting ? syntaxHighlighting(bodhakHighlightStyle) : null,
        EditorView.theme({
          "&": { height: "100%", backgroundColor: "#1e1e1e" },
          ".cm-content": { 
            fontFamily: "monospace", 
            padding: "10px 0" 
          },
          "&.cm-focused": { outline: "none" }
        })
      ].filter(ext => ext !== null && ext !== undefined);

      // 5. Initialize the state
      const state = EditorState.create({
        doc: data.rawCode || "",
        extensions
      });

      view = new EditorView({
        state,
        parent: container
      });

    } catch (err) {
      console.error("Manual Initialization Crash:", err);
    }
  }

  onMount(initEditor);
</script>

<div class="editor-shell">
  <div bind:this={container} class="editor-container"></div>
</div>
{@html data.highlightedHtml}

<style>
  @reference "tailwindcss";

  .editor-shell {
    @apply border border-slate-700 rounded-lg overflow-hidden bg-[#1e1e1e] min-h-[300px];
  }

  .editor-container {
    height: 100%;
  }
</style>