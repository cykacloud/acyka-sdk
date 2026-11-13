<script lang="ts">
	/**
	 * ⌘K: every guide, every section of one, every operation and every shape,
	 * from one box.
	 *
	 * The kit's `Command` is the shell — the overlay, the field, the arrows and
	 * the enter key. What is in the list and how it is ranked is this site's:
	 * a reader typing `titles` wants `List titles` before a paragraph that
	 * mentions titles, so a match at the start of a label beats one in the
	 * middle of it, a label beats an address, and an address beats the words
	 * nobody sees.
	 */
	import { goto } from '$app/navigation';
	import { Command } from '@cyka/ui';
	import IconBook from '@tabler/icons-svelte/icons/book-2';
	import IconHash from '@tabler/icons-svelte/icons/hash';
	import IconBraces from '@tabler/icons-svelte/icons/braces';
	import IconCornerDownLeft from '@tabler/icons-svelte/icons/corner-down-left';
	import type { Found } from '$lib/nav';

	let { open = $bindable(false), found }: { open?: boolean; found: Found[] } = $props();

	let value = $state('');
	let active = $state(0);

	const KIND: Record<Found['kind'], string> = {
		guide: 'Guides',
		section: 'In the guides',
		operation: 'Reference',
		shape: 'Shapes'
	};

	/** How well one thing answers what was typed; 0 is not at all. */
	function score(item: Found, words: string[]): number {
		const label = item.label.toLowerCase();
		const hint = (item.hint ?? '').toLowerCase();
		const extra = (item.words ?? '').toLowerCase();
		let total = 0;
		for (const word of words) {
			if (label.startsWith(word)) total += 12;
			else if (label.split(/[\s_/-]+/).some((part) => part.startsWith(word))) total += 8;
			else if (label.includes(word)) total += 5;
			else if (hint.includes(word)) total += 3;
			else if (extra.includes(word)) total += 2;
			else return 0;
		}
		// guides first among equals, then the reference, then the rest
		return total + (item.kind === 'guide' ? 1.5 : item.kind === 'operation' ? 1 : 0);
	}

	const results = $derived.by(() => {
		const words = value.trim().toLowerCase().split(/\s+/).filter(Boolean);
		if (!words.length) {
			// with nothing typed: where people usually go
			return found.filter((f) => f.kind === 'guide').slice(0, 8);
		}
		return found
			.map((item) => ({ item, s: score(item, words) }))
			.filter((one) => one.s > 0)
			.sort((a, b) => b.s - a.s)
			.slice(0, 40)
			.map((one) => one.item);
	});

	/** The rows, grouped by kind in the order they first appear in the ranking. */
	const sections = $derived.by(() => {
		const order: Found['kind'][] = [];
		const by = new Map<Found['kind'], { item: Found; at: number }[]>();
		results.forEach((item, at) => {
			if (!by.has(item.kind)) {
				by.set(item.kind, []);
				order.push(item.kind);
			}
			by.get(item.kind)!.push({ item, at });
		});
		return order.map((kind) => ({ kind, rows: by.get(kind)! }));
	});

	// The list is drawn grouped, so the index the arrows move is the position in
	// the grouped list rather than in the ranking.
	const flat = $derived(sections.flatMap((s) => s.rows.map((r) => r.item)));

	function pick(index: number) {
		const item = flat[index];
		if (!item) return;
		open = false;
		goto(item.href);
	}

	// keep the highlighted row in view as the arrows move it
	$effect(() => {
		void active;
		if (!open) return;
		requestAnimationFrame(() => {
			document.querySelector('.found[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
		});
	});
</script>

<Command
	bind:open
	bind:value
	bind:active
	count={flat.length}
	placeholder="Search guides, operations and shapes"
	onpick={pick}
>
	{#if flat.length === 0}
		<p class="none">Nothing called “{value}”. Try an address, like <code>/titles</code>.</p>
	{/if}
	{#each sections as section (section.kind)}
		<p class="kind">{value.trim() ? KIND[section.kind] : 'Start with'}</p>
		{#each section.rows as row (row.item.href)}
			{@const at = flat.indexOf(row.item)}
			<a
				class="found"
				href={row.item.href}
				data-active={at === active}
				onmousemove={() => (active = at)}
				onclick={(e) => {
					e.preventDefault();
					pick(at);
				}}
			>
				<span class="mark">
					{#if row.item.kind === 'operation'}
						<span class="verb" data-verb={row.item.verb}>{row.item.verb}</span>
					{:else if row.item.kind === 'shape'}
						<IconBraces size={16} stroke={1.7} />
					{:else if row.item.kind === 'section'}
						<IconHash size={16} stroke={1.7} />
					{:else}
						<IconBook size={16} stroke={1.7} />
					{/if}
				</span>
				<span class="words">
					<span class="label">{row.item.label}</span>
					{#if row.item.hint}
						<span class="hint" class:mono={row.item.kind === 'operation'}>{row.item.hint}</span>
					{/if}
				</span>
				<span class="go" aria-hidden="true"><IconCornerDownLeft size={14} stroke={1.8} /></span>
			</a>
		{/each}
	{/each}
	<p class="keys" aria-hidden="true">
		<span><kbd>↑</kbd><kbd>↓</kbd> move</span>
		<span><kbd>↵</kbd> open</span>
		<span><kbd>esc</kbd> close</span>
	</p>
</Command>

<style>
	.kind {
		margin: var(--s-2) var(--s-2) var(--s-1);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.kind:first-of-type {
		margin-top: var(--s-1);
	}

	.found {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: 8px var(--s-2);
		border-radius: var(--r-control);
		color: var(--text);
		text-decoration: none;
		scroll-margin: var(--s-6);
	}

	.found:hover {
		text-decoration: none;
	}

	.found[data-active='true'] {
		background: var(--surface-2);
	}

	.mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 3.6em;
		color: var(--text-muted);
	}

	.words {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
	}

	.label {
		font-size: var(--fs-sub);
		font-weight: 550;
		color: var(--text-title);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hint {
		font-size: 12px;
		color: var(--text-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hint.mono {
		font-family: var(--font-mono);
		font-size: 11px;
	}

	.go {
		flex: none;
		color: var(--text-muted);
		opacity: 0;
	}

	.found[data-active='true'] .go {
		opacity: 1;
	}

	.none {
		margin: var(--s-4) var(--s-2);
		color: var(--text-muted);
		font-size: var(--fs-sub);
	}

	.none code {
		font-family: var(--font-mono);
	}

	.keys {
		position: sticky;
		bottom: calc(-1 * var(--s-2));
		display: flex;
		gap: var(--s-4);
		margin: var(--s-2) calc(-1 * var(--s-2)) calc(-1 * var(--s-2));
		padding: var(--s-2) var(--s-4);
		border-top: 1px solid var(--border);
		background: var(--panel);
		font-size: 11px;
		color: var(--text-muted);
	}

	.keys span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	@media (hover: none) {
		.keys {
			display: none;
		}
	}
</style>
