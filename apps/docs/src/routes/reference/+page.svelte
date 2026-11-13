<script lang="ts">
	/**
	 * Every operation, by what it is about.
	 *
	 * A card per group and a line per operation: the verb, the name a person
	 * would say, and the address — the three things somebody scanning for "the
	 * one that lists titles" reads, in the order they read them.
	 */
	import { inline } from '$lib/inline';

	let { data } = $props();
</script>

<svelte:head>
	<title>Reference — acyka api</title>
	<meta name="description" content="Every operation the acyka API answers, by what it is about." />
</svelte:head>

<div class="index">
	<header class="prose rise">
		<p class="eyebrow">API reference</p>
		<h1>Every operation, by what it is about</h1>
		<p class="lede">
			{data.counts.operations} operations and {data.counts.models} shapes. Each page carries the call in
			curl and six languages, what it takes, an example of what it answers, and every shape inside that
			answer. Press <kbd>/</kbd> to jump to one by name.
		</p>
		<p class="base">
			<span>Base address</span>
			<code>https://api.acyka.cc/api/v1</code>
		</p>
	</header>

	<div class="groups stagger" style="--d: 80ms">
		{#each data.groups as group, i (group.tag)}
			<section class="group" id={group.tag} style="--i: {i}">
				<div class="title">
					<h2>{group.tag}</h2>
					<span class="count">{group.ops.length}</span>
				</div>
				{#if group.doc}<p class="doc">{@html inline(group.doc)}</p>{/if}

				<ul>
					{#each group.ops as op (op.href)}
						<li>
							<a href={op.href}>
								<span class="verb" data-verb={op.verb}>{op.verb}</span>
								<span class="words">
									<span class="label">{op.label}</span>
									<code>{op.address}</code>
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</div>

<style>
	.index {
		max-width: 76rem;
	}

	header {
		max-width: 44rem;
	}

	.eyebrow {
		margin: 0 0 var(--s-2) !important;
		font-size: 13px;
		font-weight: 600;
		color: var(--accent-hover) !important;
	}

	:global(:root[data-theme='light']) .eyebrow {
		color: var(--accent-text) !important;
	}

	.lede {
		font-size: 1.1rem;
		color: var(--text-2) !important;
	}

	.base {
		display: inline-flex;
		align-items: center;
		gap: var(--s-3);
		padding: 6px 6px 6px 12px;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--code-bg);
		font-size: 13px;
		color: var(--text-muted) !important;
	}

	.base code {
		border: 0 !important;
		background: var(--surface) !important;
	}

	/* columns rather than a grid: a group of one and a group of nineteen side by
	   side in a grid row is a card with a hole in it */
	.groups {
		columns: 1;
		column-gap: var(--s-4);
		margin-top: var(--s-8);
	}

	@media (min-width: 900px) {
		.groups {
			columns: 2;
		}
	}

	.group {
		break-inside: avoid;
		margin-bottom: var(--s-4);
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
		padding: var(--s-4);
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		background: color-mix(in oklab, var(--surface) 35%, transparent);
		scroll-margin-top: calc(var(--top-h) + var(--s-4));
	}

	.title {
		display: flex;
		align-items: center;
		gap: var(--s-2);
	}

	h2 {
		margin: 0;
		font-size: 1.1rem;
		letter-spacing: -0.01em;
		text-transform: capitalize;
		color: var(--text-title);
	}

	.count {
		padding: 0 7px;
		border-radius: var(--r-full);
		background: var(--surface-2);
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
	}

	.doc {
		margin: 0;
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-muted);
	}

	ul {
		list-style: none;
		margin: var(--s-1) calc(-1 * var(--s-2)) 0;
		padding: 0;
	}

	li a {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: 7px var(--s-2);
		border-radius: 8px;
		color: var(--text);
		text-decoration: none;
		transition: background var(--t) var(--ease);
	}

	li a:hover {
		background: var(--hover);
		text-decoration: none;
	}

	.words {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--s-3);
		flex: 1;
		min-width: 0;
	}

	.label {
		font-size: 14px;
		font-weight: 550;
		color: var(--text-title);
		white-space: nowrap;
	}

	.words code {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
