<script>
  import { CodeBlock } from "$components"
	import StaticCodeBlock from "$components/staticCodeBlock.svelte";
  let {data}= $props();
</script>

<StaticCodeBlock code={data.jsx.highlightedCode}/>
<CodeBlock code={data.html.code} highlightedCode={data.html.highlightedCode} language={data.html.language} lineCount={data.html.lineCount}/>