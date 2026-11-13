<script lang="ts">
	/**
	 * The frame a guide is written inside.
	 *
	 * A component rather than eight pages each with their own header: the
	 * eyebrow, the title, the standfirst and the two doors at the bottom are the
	 * same shape every time, and eight copies of them is eight chances for one
	 * page to look like a different site.
	 */
	import IconArrowLeft from '@tabler/icons-svelte/icons/arrow-left';
	import IconArrowRight from '@tabler/icons-svelte/icons/arrow-right';
	import { GUIDES } from '$lib/nav';
	import { page } from '$app/state';

	let {
		title,
		lede,
		children
	}: { title: string; lede: string; children: import('svelte').Snippet } = $props();

	const at = $derived(GUIDES.findIndex((one) => one.href === page.url.pathname));
	const prev = $derived(at > 0 ? GUIDES[at - 1] : undefined);
	const next = $derived(at >= 0 ? GUIDES[at + 1] : undefined);
</script>

<svelte:head>
	<title>{title} — acyka api</title>
	<meta name="description" content={lede} />
	<meta property="og:title" content="{title} — acyka api" />
	<meta property="og:description" content={lede} />
</svelte:head>

<article class="prose guide">
	<header>
		<p class="eyebrow">Guide{at >= 0 ? ` · ${at + 1} of ${GUIDES.length}` : ''}</p>
		<h1>{title}</h1>
		<p class="lede">{lede}</p>
	</header>

	{@render children()}

	{#if prev || next}
		<nav class="doors" aria-label="Guides">
			{#if prev}
				<a class="door prev" href={prev.href}>
					<span class="dir"><IconArrowLeft size={14} stroke={2} /> Previous</span>
					<span class="what">{prev.label}</span>
				</a>
			{:else}
				<span></span>
			{/if}
			{#if next}
				<a class="door next" href={next.href}>
					<span class="dir">Next <IconArrowRight size={14} stroke={2} /></span>
					<span class="what">{next.label}</span>
				</a>
			{/if}
		</nav>
	{/if}
</article>

<style>
	.guide {
		max-width: 46rem;
	}

	header {
		padding-bottom: var(--s-6);
		border-bottom: 1px solid var(--border);
	}

	.eyebrow {
		margin: 0 0 var(--s-2);
		font-size: 13px;
		font-weight: 600;
		color: var(--accent-hover);
	}

	:global(:root[data-theme='light']) .eyebrow {
		color: var(--accent-text);
	}

	.lede {
		margin: var(--s-3) 0 0;
		font-size: 1.125rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	.doors {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s-3);
		margin-top: var(--s-12);
	}

	.door {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: var(--s-3) var(--s-4);
		border: 1px solid var(--border);
		border-radius: var(--r-md);
		text-decoration: none;
		transition: border-color var(--t) var(--ease), background var(--t) var(--ease);
	}

	.door:hover {
		border-color: color-mix(in oklab, var(--accent) 55%, var(--border));
		background: var(--hover);
		text-decoration: none;
	}

	.next {
		grid-column: 2;
		text-align: right;
		align-items: flex-end;
	}

	.dir {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 12.5px;
		color: var(--text-muted);
	}

	.what {
		font-weight: 600;
		color: var(--text-title);
	}

	@media (max-width: 560px) {
		.doors {
			grid-template-columns: 1fr;
		}

		.next {
			grid-column: 1;
		}
	}
</style>
