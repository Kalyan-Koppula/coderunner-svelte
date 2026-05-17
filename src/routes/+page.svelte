<script>
  import { CodeBlock } from "$components"
  let {data}= $props();
</script>

<CodeBlock code={data.jsx.code} highlightedCode={data.jsx.highlightedCode}/>
<CodeBlock code={data.html.code} highlightedCode={data.html.highlightedCode} language={data.html.language}/>