<script>
  let { code, showCopyButton = false } = $props();
</script>

<div>
    <div>
        <button 
            class="mask-icon [--icon:url(/static/icons/copy.svg)] w-10 h-10 mask-size-[24px] [-webkit-mask-size:24px] bg-slate-600 hover:bg-blue-600 transition-colors"
            aria-label="Copy code">
        </button>
    </div>
</div>
<pre class="cm-s-custom">{@html code}</pre>
