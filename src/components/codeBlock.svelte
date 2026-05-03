<script>
  import { bodhakHighlightStyle } from '$lib';
  import { onMount } from 'svelte';
  
  let { language, code, highlightedCode } = $props();
  let container = $state(null);
  let view = $state(null);
  let isInteractive = $state(false); // Track if CM has taken over

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

      // 4. Build the extension list and filter out any accidental undefineds
      const extensions = [
        basicSetup,
        javascript({ jsx: true }),
        syntaxHighlighting ? syntaxHighlighting(bodhakHighlightStyle) : null,
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-content": {
            padding: 0
          },
          ".cm-line": {
            padding: 0
          }
        })
      ].filter(ext => ext !== null && ext !== undefined);

      // 5. Initialize the state
      const state = EditorState.create({
        doc: code || "",
        extensions
      });

      view = new EditorView({
        state,
        parent: container
      });

	  isInteractive = true;

    } catch (err) {
      console.error("Manual Initialization Crash:", err);
    }
  }

  onMount(initEditor);
</script>

<pre bind:this={container} class="cm-s-custom">
  {#if !isInteractive}
    {@html highlightedCode} 
  {/if}
</pre>