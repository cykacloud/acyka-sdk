<script lang="ts">
	/**
	 * The frame: a bar, a rail of addresses, the page, and what is on it.
	 *
	 * Written here rather than taken from the kit, and that is a decision worth
	 * recording. `@cyka/ui` exports a `Shell` which is the right shape for a
	 * settings hub — a fixed rail and a column of cards. Documentation wants
	 * three columns (the rail, the page, and the page's own headings) and a
	 * front page with none of them. Everything inside the frame is the kit's:
	 * the tokens, the motion, the search overlay and every control.
	 *
	 * Search is ⌘K and nothing else. A filter box over the rail and a search box
	 * in the bar were two ways of asking the same question with two different
	 * answers; the overlay finds guides, sections, operations and shapes, and
	 * the rail goes back to being a table of contents.
	 */
	import { page } from '$app/state';
	import IconSearch from '@tabler/icons-svelte/icons/search';
	import IconMenu from '@tabler/icons-svelte/icons/menu-2';
	import IconX from '@tabler/icons-svelte/icons/x';
	import IconBrandGithub from '@tabler/icons-svelte/icons/brand-github';
	import type { Found, Group } from '$lib/nav';
	import Palette from '$lib/Palette.svelte';
	import Theme from '$lib/Theme.svelte';
	import Toc from '$lib/Toc.svelte';
	import '../app.css';

	let {
		data,
		children
	}: { data: { rail: Group[]; found: Found[] }; children: import('svelte').Snippet } = $props();

	let open = $state(false);
	let searching = $state(false);
	let mac = $state(true);

	const at = $derived(page.url.pathname);
	/** the front page and the playground are wider than a column of prose */
	const bare = $derived(at === '/' || at.startsWith('/playground'));
	/** the headings column, where there are headings worth listing */
	const toc = $derived(at.startsWith('/docs'));

	/**
	 * Which link is the page.
	 *
	 * Exact first, then the longest prefix — without the second `/docs/errors`
	 * marks nothing while the rail shows `/docs`; without the first, `/docs`
	 * marks every guide as well as itself.
	 */
	const here = $derived.by(() => {
		const all = data.rail.flatMap((g) => g.links);
		return (
			all.find((l) => l.href === at) ??
			all
				.filter((l) => at.startsWith(`${l.href}/`))
				.sort((a, b) => b.href.length - a.href.length)[0]
		);
	});

	// A rail that stays open after a tap is a rail covering the page somebody
	// just asked for.
	$effect(() => {
		void page.url.pathname;
		open = false;
	});

	$effect(() => {
		mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
	});

	// the current link in view when the page opens on something low in the rail
	$effect(() => {
		void here;
		requestAnimationFrame(() => {
			document
				.querySelector('.rail a[aria-current="page"]')
				?.scrollIntoView({ block: 'nearest' });
		});
	});

	function keys(e: KeyboardEvent) {
		const typing =
			e.target instanceof HTMLElement &&
			(e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			searching = !searching;
		} else if (e.key === '/' && !typing && !searching) {
			e.preventDefault();
			searching = true;
		}
	}
</script>

<svelte:window onkeydown={keys} />

<svelte:head>
	<meta name="theme-color" content="#0b0b0f" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#f7f7fb" media="(prefers-color-scheme: light)" />
</svelte:head>

<div class="frame" class:open class:bare class:toc id="top">
	<header class="top">
		{#if !bare}
			<button
				type="button"
				class="icon menu"
				aria-label={open ? 'Close the menu' : 'Open the menu'}
				aria-expanded={open}
				onclick={() => (open = !open)}
			>
				{#if open}<IconX size={20} stroke={1.8} />{:else}<IconMenu size={20} stroke={1.8} />{/if}
			</button>
		{/if}

		<a class="brand" href="/">
			<img src="/logo.svg" alt="" width="26" height="26" />
			<span class="name">acyka</span>
			<span class="tag">developers</span>
		</a>

		<nav class="wide" aria-label="Sections">
			<a href="/docs" aria-current={at.startsWith('/docs') ? 'page' : undefined}>Guides</a>
			<a href="/reference" aria-current={at.startsWith('/reference') ? 'page' : undefined}>
				Reference
			</a>
			<a href="/playground" aria-current={at.startsWith('/playground') ? 'page' : undefined}>
				Playground
			</a>
		</nav>

		<button type="button" class="ask" onclick={() => (searching = true)}>
			<IconSearch size={16} stroke={1.8} />
			<span class="words">Search the docs</span>
			<span class="keys" aria-hidden="true"><kbd>{mac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd></span>
		</button>

		<div class="end">
			<button
				type="button"
				class="icon find"
				aria-label="Search"
				onclick={() => (searching = true)}
			>
				<IconSearch size={18} stroke={1.8} />
			</button>
			<Theme />
			<a
				class="icon"
				href="https://github.com/cykacloud/acyka-sdk"
				target="_blank"
				rel="noreferrer"
				aria-label="The source on GitHub"
			>
				<IconBrandGithub size={18} stroke={1.7} />
			</a>
		</div>
	</header>

	<div class="body">
		{#if !bare}
			<aside class="rail" aria-label="Contents">
				<nav class="sections-small" aria-label="Sections">
					<a href="/docs" aria-current={at.startsWith('/docs') ? 'page' : undefined}>Guides</a>
					<a href="/reference" aria-current={at.startsWith('/reference') ? 'page' : undefined}>
						Reference
					</a>
					<a href="/playground">Playground</a>
				</nav>

				{#each data.rail as group (group.label)}
					<div class="group">
						<p class="label">{group.label}</p>
						{#each group.links as link (link.href)}
							<a
								href={link.href}
								aria-current={link === here ? 'page' : undefined}
								title={link.hint ? `${link.verb} ${link.hint}` : undefined}
							>
								{#if link.verb}<span class="verb" data-verb={link.verb}>{link.verb}</span>{/if}
								<span class="text">{link.label}</span>
							</a>
						{/each}
					</div>
				{/each}
			</aside>
		{/if}

		<main>{@render children()}</main>

		{#if toc && !bare}
			<aside class="side">
				<div class="stick">
					{#key at}
						<Toc />
					{/key}
				</div>
			</aside>
		{/if}
	</div>

	<footer class="foot">
		<span>acyka api · <code>v1</code></span>
		<span class="links">
			<a href="https://acyka.cc">acyka.cc</a>
			<a href="/docs">Guides</a>
			<a href="/reference">Reference</a>
			<a href="https://status.cyka.cloud">Status</a>
			<a href="https://github.com/cykacloud/acyka-sdk">Source</a>
		</span>
	</footer>
</div>

<Palette bind:open={searching} found={data.found} />

<style>
	.frame {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	/* --- the bar ------------------------------------------------------------- */

	.top {
		position: sticky;
		top: 0;
		z-index: 30;
		display: flex;
		align-items: center;
		gap: var(--s-3);
		height: var(--top-h);
		padding: 0 var(--s-4);
		background: color-mix(in oklab, var(--bg-solid) 82%, transparent);
		backdrop-filter: saturate(1.6) blur(14px);
		-webkit-backdrop-filter: saturate(1.6) blur(14px);
		border-bottom: 1px solid var(--border);
	}

	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: var(--control-h);
		height: var(--control-h);
		border: 0;
		border-radius: var(--r-control);
		background: transparent;
		color: var(--text-2);
		cursor: pointer;
	}

	.icon:hover {
		background: var(--surface-2);
		color: var(--text);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		flex: none;
		color: var(--text-title);
		text-decoration: none;
	}

	.brand:hover {
		text-decoration: none;
	}

	.name {
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.02em;
	}

	.tag {
		padding: 2px 8px;
		border-radius: var(--r-full);
		background: color-mix(in oklab, var(--accent) 16%, transparent);
		color: var(--accent-hover);
		font-size: 11.5px;
		font-weight: 600;
	}

	:global(:root[data-theme='light']) .tag {
		color: var(--accent-text);
	}

	.wide {
		display: none;
		gap: 2px;
		margin-left: var(--s-4);
	}

	.wide a {
		padding: 7px 12px;
		border-radius: var(--r-control);
		color: var(--text-2);
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
		transition: color var(--t) var(--ease), background var(--t) var(--ease);
	}

	.wide a:hover {
		color: var(--text-title);
		background: var(--hover);
	}

	.wide a[aria-current='page'] {
		color: var(--text-title);
		background: var(--surface-2);
	}

	.ask {
		display: none;
		align-items: center;
		gap: var(--s-2);
		width: min(320px, 30vw);
		height: 38px;
		margin-left: auto;
		padding: 0 6px 0 12px;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--surface);
		color: var(--text-muted);
		font: inherit;
		font-size: 14px;
		cursor: pointer;
		transition: border-color var(--t) var(--ease), color var(--t) var(--ease);
	}

	.ask:hover {
		border-color: var(--border-strong);
		color: var(--text-2);
	}

	.ask .words {
		flex: 1;
		text-align: left;
	}

	.ask .keys {
		display: inline-flex;
		gap: 3px;
	}

	.end {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-left: auto;
	}

	/* --- the body: rail, page, headings ------------------------------------- */

	.body {
		flex: 1;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		width: 100%;
		max-width: 1600px;
		margin: 0 auto;
	}

	/*
	 * On a phone the rail is not squeezed, it is put away — a rail narrowed to
	 * icons is a rail nobody can read, and this list is words. It slides over
	 * the page rather than pushing it, so the address somebody is reading does
	 * not move under them.
	 */
	.rail {
		position: fixed;
		inset: var(--top-h) 0 0 0;
		z-index: 20;
		display: none;
		flex-direction: column;
		gap: var(--s-6);
		padding: var(--s-4) var(--s-3) var(--s-12);
		background: var(--bg-solid);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.frame.open .rail {
		display: flex;
	}

	.sections-small {
		display: flex;
		gap: var(--s-1);
		padding-bottom: var(--s-3);
		border-bottom: 1px solid var(--border);
	}

	.sections-small a {
		flex: 1;
		padding: 8px;
		border-radius: var(--r-control);
		background: var(--surface);
		color: var(--text-2);
		font-size: 14px;
		font-weight: 500;
		text-align: center;
		text-decoration: none;
	}

	.sections-small a[aria-current='page'] {
		background: var(--surface-2);
		color: var(--text-title);
	}

	.group {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.label {
		margin: 0 0 6px;
		padding: 0 10px;
		font-size: 11.5px;
		font-weight: 650;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-title);
	}

	.rail .group a {
		position: relative;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 6px 10px;
		border-radius: 8px;
		color: var(--text-2);
		font-size: 14px;
		line-height: 1.35;
		text-decoration: none;
		transition: background var(--t) var(--ease), color var(--t) var(--ease);
	}

	.rail .group a:hover {
		background: var(--hover);
		color: var(--text-title);
	}

	.rail .group a[aria-current='page'] {
		background: color-mix(in oklab, var(--accent) 13%, transparent);
		color: var(--text-title);
		font-weight: 600;
	}

	.rail .group a[aria-current='page']::before {
		content: '';
		position: absolute;
		left: -12px;
		top: 8px;
		bottom: 8px;
		width: 3px;
		border-radius: 0 3px 3px 0;
		background: var(--accent);
	}

	.rail .verb {
		min-width: 3.5em;
		font-size: 9.5px;
	}

	.text {
		min-width: 0;
	}

	main {
		/*
		 * A grid item is `min-width: auto`, so a wide reference table would push
		 * this column past the screen and take the text with it. This is the
		 * line that stops the page scrolling sideways.
		 */
		min-width: 0;
		padding: var(--s-6) var(--s-4) var(--s-12);
	}

	.bare main {
		padding: 0;
	}

	.side {
		display: none;
	}

	/* --- the foot ------------------------------------------------------------ */

	.foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-3);
		padding: var(--s-6) var(--s-4) calc(var(--s-6) + var(--safe-bottom));
		border-top: 1px solid var(--border);
		color: var(--text-muted);
		font-size: 13px;
	}

	.foot code {
		font-family: var(--font-mono);
	}

	.foot .links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-4);
	}

	.foot a {
		color: var(--text-2);
	}

	/* --- wider ---------------------------------------------------------------- */

	@media (min-width: 720px) {
		.ask {
			display: flex;
		}

		.find {
			display: none;
		}

		.end {
			margin-left: var(--s-2);
		}
	}

	@media (min-width: 1024px) {
		.top {
			padding: 0 var(--s-6);
		}

		.menu {
			display: none;
		}

		.wide {
			display: flex;
		}

		.sections-small {
			display: none;
		}

		.body {
			grid-template-columns: var(--rail-w) minmax(0, 1fr);
		}

		.bare .body {
			grid-template-columns: minmax(0, 1fr);
			max-width: none;
		}

		.rail {
			/* sticky rather than fixed: a fixed rail on a short viewport puts its
			   own last item below the fold with nothing to scroll */
			position: sticky;
			/* `inset` before `top`: written after, `inset: auto` resets `top` and
			   a sticky element with `top: auto` never sticks */
			inset: auto;
			top: var(--top-h);
			display: flex;
			align-self: start;
			height: calc(100dvh - var(--top-h));
			padding: var(--s-6) var(--s-4) var(--s-12) var(--s-6);
			border-right: 1px solid var(--border);
			background: transparent;
			scrollbar-width: thin;
			scrollbar-color: var(--surface-3) transparent;
		}

		main {
			padding: var(--s-8) var(--s-12) var(--s-12);
		}

		.foot {
			padding-inline: var(--s-6);
		}
	}

	@media (min-width: 1280px) {
		.frame.toc .body {
			grid-template-columns: var(--rail-w) minmax(0, 1fr) var(--toc-w);
		}

		.frame.toc .side {
			display: block;
		}

		.stick {
			position: sticky;
			top: var(--top-h);
			max-height: calc(100dvh - var(--top-h));
			overflow-y: auto;
			padding: var(--s-8) var(--s-6) var(--s-8) 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rail .group a,
		.wide a,
		.ask {
			transition: none;
		}
	}
</style>
