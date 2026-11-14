<script lang="ts">
	/**
	 * One block of code, coloured on the server and copyable in the browser.
	 *
	 * `html` is what shiki produced. When there is none — a block written in a
	 * guide that the loader did not colour — the plain text is shown, which is
	 * readable and is better than nothing arriving at all.
	 *
	 * The copy button lives in the block's bar when it has one and floats over
	 * the corner when it does not; either way it is always visible, because a
	 * button that appears only on hover is one a touch screen cannot reach.
	 */
	import { CopyButton, toast } from '@cyka/ui';
	import type { Snippet } from 'svelte';

	let {
		code,
		html,
		label,
		bar,
		flush = false
	}: {
		code: string;
		html?: string;
		/** a caption in the bar — a file name, or what the block is for */
		label?: string;
		/** or the whole bar's left side, for a block with tabs in it */
		bar?: Snippet;
		/** no border or radius, for a block that sits inside another card */
		flush?: boolean;
	} = $props();
</script>

<figure class:flush>
	{#if label || bar}
		<div class="bar">
			{#if bar}{@render bar()}{:else}<span class="caption">{label}</span>{/if}
			<span class="copy-in">
				<CopyButton value={code} onfail={() => toast('could not copy', 'error')} />
			</span>
		</div>
	{/if}

	<div class="block">
		{#if html}
			<!-- shiki's own markup: spans with inline colours, nothing else -->
			{@html html}
		{:else}
			<pre><code>{code}</code></pre>
		{/if}

		{#if !label && !bar}
			<span class="copy">
				<CopyButton value={code} onfail={() => toast('could not copy', 'error')} />
			</span>
		{/if}
	</div>
</figure>

<style>
	figure {
		margin: 0;
		min-width: 0;
		border: 1px solid var(--border);
		border-radius: var(--r-md);
		background: var(--code-bg);
		overflow: hidden;
	}

	figure.flush {
		border: 0;
		border-radius: 0;
		background: transparent;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-2);
		min-height: 40px;
		padding: 0 var(--s-1) 0 var(--s-4);
		border-bottom: 1px solid var(--border);
		background: color-mix(in oklab, var(--surface) 55%, transparent);
	}

	.caption {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.copy-in {
		flex: none;
	}

	.block {
		position: relative;
	}

	.block :global(pre) {
		margin: 0;
		padding: var(--s-4);
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 13px;
		line-height: 1.7;
		tab-size: 2;
		scrollbar-width: thin;
	}

	.copy {
		position: absolute;
		top: var(--s-1);
		right: var(--s-1);
		opacity: 0.55;
		transition: opacity var(--t) var(--ease);
	}

	.block:hover .copy,
	.copy:focus-within {
		opacity: 1;
	}

	@media (hover: none) {
		.copy {
			opacity: 1;
		}
	}
</style>
