<script lang="ts">
	/**
	 * On this page: the headings of whatever `main` holds, and which one is
	 * being read.
	 *
	 * Read off the rendered page rather than declared by each page, so a
	 * heading somebody adds to a guide is in the list without anybody
	 * remembering to list it — and a reference page, whose headings are the
	 * shapes it happens to mention, gets the same thing for free. "Being read"
	 * is the last heading whose top has passed a line a third of the way down
	 * the window, which is where eyes are rather than where the page starts.
	 */
	import { afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';

	type Heading = { id: string; label: string; depth: 2 | 3 };

	let headings = $state<Heading[]>([]);
	let current = $state('');

	function read() {
		const found = document.querySelectorAll<HTMLElement>('main :is(h2, h3)[id]');
		headings = [...found]
			.filter((h) => !h.closest('[data-toc-skip]'))
			.map((h) => ({
				id: h.id,
				// the anchor's `#` is part of the heading's text; it is not part of its name
				label: (h.textContent ?? '').replace(/#\s*$/, '').trim(),
				depth: h.tagName === 'H3' ? 3 : 2
			}));
		where();
	}

	function where() {
		const line = window.innerHeight / 3;
		let at = headings[0]?.id ?? '';
		for (const h of headings) {
			const el = document.getElementById(h.id);
			if (el && el.getBoundingClientRect().top <= line) at = h.id;
		}
		// the bottom of a page whose last section is short can never put its
		// heading over the line, so the end of the page counts as reaching it
		if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
			at = headings.at(-1)?.id ?? at;
		}
		current = at;
	}

	afterNavigate(async () => {
		await tick();
		read();
	});

	$effect(() => {
		let pending = false;
		const onscroll = () => {
			if (pending) return;
			pending = true;
			requestAnimationFrame(() => {
				pending = false;
				where();
			});
		};
		addEventListener('scroll', onscroll, { passive: true });
		addEventListener('resize', onscroll, { passive: true });
		return () => {
			removeEventListener('scroll', onscroll);
			removeEventListener('resize', onscroll);
		};
	});
</script>

{#if headings.length > 1}
	<nav class="toc" aria-label="On this page">
		<p class="title">On this page</p>
		<ul>
			{#each headings as h (h.id)}
				<li class:deep={h.depth === 3}>
					<a href="#{h.id}" aria-current={h.id === current ? 'location' : undefined}>{h.label}</a>
				</li>
			{/each}
		</ul>
		<a class="up" href="#top">Back to top ↑</a>
	</nav>
{/if}

<style>
	.toc {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
		font-size: 13px;
	}

	.title {
		margin: 0;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		border-left: 1px solid var(--border);
	}

	li a {
		display: block;
		margin-left: -1px;
		padding: 4px 0 4px var(--s-3);
		border-left: 2px solid transparent;
		color: var(--text-muted);
		line-height: 1.4;
		text-decoration: none;
		transition: color var(--t) var(--ease), border-color var(--t) var(--ease);
	}

	li.deep a {
		padding-left: calc(var(--s-3) + 12px);
		font-size: 12.5px;
	}

	li a:hover {
		color: var(--text);
		text-decoration: none;
	}

	li a[aria-current='location'] {
		color: var(--text-title);
		border-left-color: var(--accent);
		font-weight: 550;
	}

	.up {
		margin-top: var(--s-2);
		color: var(--text-muted);
		font-size: 12px;
	}

	.up:hover {
		color: var(--text);
		text-decoration: none;
	}

	@media (prefers-reduced-motion: reduce) {
		li a {
			transition: none;
		}
	}
</style>
