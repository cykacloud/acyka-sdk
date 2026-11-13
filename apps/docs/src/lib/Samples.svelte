<script lang="ts">
	/**
	 * The same call in seven languages, one visible at a time, the switch in the
	 * block's own bar.
	 *
	 * The choice is the site's, not the block's (`language.svelte.ts`): picking
	 * Python here turns every other block, and the next page, to Python.
	 */
	import Code from '$lib/Code.svelte';
	import { language, recall, remember } from '$lib/language.svelte';

	let {
		samples,
		label
	}: {
		samples: { id: string; label: string; code: string; html?: string }[];
		/** said before the tabs, where a block needs a name as well */
		label?: string;
	} = $props();

	$effect(() => {
		recall();
	});

	const showing = $derived(samples.find((s) => s.id === language.chosen) ?? samples[0]);
</script>

{#if showing}
	<Code code={showing.code} html={showing.html}>
		{#snippet bar()}
			<div class="tabs" role="tablist" aria-label={label ?? 'Language'}>
				{#if label}<span class="name">{label}</span>{/if}
				{#each samples as sample (sample.id)}
					<button
						type="button"
						role="tab"
						aria-selected={sample.id === showing.id}
						onclick={() => remember(sample.id)}
					>
						{sample.label}
					</button>
				{/each}
			</div>
		{/snippet}
	</Code>
{/if}

<style>
	.tabs {
		display: flex;
		align-items: stretch;
		gap: 2px;
		min-width: 0;
		margin-left: calc(-1 * var(--s-2));
		overflow-x: auto;
		scrollbar-width: none;
	}

	.tabs::-webkit-scrollbar {
		display: none;
	}

	.name {
		display: inline-flex;
		align-items: center;
		padding: 0 var(--s-3) 0 var(--s-2);
		margin-right: var(--s-1);
		border-right: 1px solid var(--border);
		font-size: 12px;
		font-weight: 600;
		color: var(--text-2);
		white-space: nowrap;
	}

	button {
		position: relative;
		flex: none;
		height: 40px;
		padding: 0 10px;
		border: 0;
		background: none;
		color: var(--text-muted);
		font: inherit;
		font-size: 12.5px;
		font-weight: 500;
		cursor: pointer;
		transition: color var(--t) var(--ease);
	}

	button:hover {
		color: var(--text-title);
	}

	button[aria-selected='true'] {
		color: var(--text-title);
	}

	button[aria-selected='true']::after {
		content: '';
		position: absolute;
		left: 10px;
		right: 10px;
		bottom: -1px;
		height: 2px;
		border-radius: 2px;
		background: var(--accent);
	}
</style>
