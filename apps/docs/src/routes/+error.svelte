<script lang="ts">
	/**
	 * An address nothing was written for.
	 *
	 * The site is files, so this is `404.html` rendering in the browser: the
	 * frame without its rail, a line about what happened, and the three doors
	 * that are always there — plus ⌘K, which finds the page somebody meant.
	 */
	import { page } from '$app/state';
	import IconArrowRight from '@tabler/icons-svelte/icons/arrow-right';
</script>

<svelte:head>
	<title>Not here — acyka api</title>
</svelte:head>

<div class="gone rise">
	<p class="code">{page.status}</p>
	<h1>{page.status === 404 ? 'Nothing is written at this address' : 'Something went wrong'}</h1>
	<p class="lede">
		<code>{page.url.pathname}</code> is not a page here. Press <kbd>/</kbd> to search for the one you
		meant, or start from one of these.
	</p>
	<nav>
		<a href="/docs">Guides <IconArrowRight size={14} stroke={2} /></a>
		<a href="/reference">Reference <IconArrowRight size={14} stroke={2} /></a>
		<a href="/playground">Playground <IconArrowRight size={14} stroke={2} /></a>
	</nav>
</div>

<style>
	.gone {
		max-width: 40rem;
		margin: 12vh auto 0;
		text-align: center;
	}

	.code {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 4rem;
		font-weight: 700;
		letter-spacing: -0.04em;
		background: linear-gradient(160deg, var(--accent-hover), var(--accent));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	h1 {
		margin: var(--s-2) 0 0;
		font-size: 1.6rem;
		letter-spacing: -0.02em;
		color: var(--text-title);
	}

	.lede {
		margin: var(--s-3) 0 0;
		line-height: 1.6;
		color: var(--text-2);
	}

	.lede code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		overflow-wrap: anywhere;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--s-2);
		margin-top: var(--s-6);
	}

	nav a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		border: 1px solid var(--border);
		border-radius: 10px;
		color: var(--text-title);
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
	}

	nav a:hover {
		border-color: color-mix(in oklab, var(--accent) 55%, var(--border));
		background: var(--hover);
	}
</style>
