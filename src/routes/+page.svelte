<script>
	let { data } = $props();
</script>
<svelte:head><title>Code Block Example</title></svelte:head>
<h1>Welcome to SvelteKit</h1>
{@html data.highlightedHtml}