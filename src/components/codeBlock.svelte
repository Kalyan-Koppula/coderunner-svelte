<script>
  import { onMount } from 'svelte';
  import { mountFlyweightEditor } from '$lib/editorFlyweight';
  
  // Scoped Component Extrinsic Inputs
  let { language, code, highlightedCode } = $props();
  
  // Isolated Local Component State Instances
  let container = $state(null);
  let view = $state(null);
  let isInteractive = $state(false);

  onMount(() => {
    let active = true;

    async function init() {
      if (view || !container) return;
      
      try {
        // Triggers dynamic code-splitting chunk fetching behind the scenes
        const editorView = await mountFlyweightEditor(language, code, container);
        
        if (active) {
          view = editorView;
          isInteractive = true;
        } else {
          editorView.destroy();
        }
      } catch (err) {
        console.error("Flyweight Lazy-Load Initialization Crash:", err);
      }
    }

    init();

    // Clean up local editor instance state on component destroy
    return () => {
      active = false;
      if (view) {
        view.destroy();
      }
    };
  });
</script>

<pre bind:this={container} class="cm-s-custom">
  {#if !isInteractive}
    {@html highlightedCode} 
  {/if}
</pre>