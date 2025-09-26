<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	let { children } = $props();
</script>

<svelte:head>
	<title>{page.data.title || 'Potato Fan Club: Potato Generator'}</title>
	{#if page.data.metadesc}
		<meta name="description" content={page.data.metadesc} />
	{/if}
</svelte:head>
{@render children()}
