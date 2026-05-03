<script>
  import { CodeBlock } from "$components"
  let {data}= $props();
</script>

<CodeBlock code={data.code} highlightedCode={data.highlightedCode}/>