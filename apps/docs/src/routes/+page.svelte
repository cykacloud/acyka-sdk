<script lang="ts">
	/**
	 * The front door.
	 *
	 * Three questions, in the order a developer asks them: what is this, what
	 * does a call look like in my language, and what will bite me. The first is
	 * the headline; the second is the block beside it, in seven languages, with
	 * the install line on top because that is the first thing anybody copies;
	 * the third is the grid under it, each card a door into the guide that
	 * answers it.
	 */
	import IconArrowRight from '@tabler/icons-svelte/icons/arrow-right';
	import IconBook from '@tabler/icons-svelte/icons/book-2';
	import IconCode from '@tabler/icons-svelte/icons/code';
	import IconPlayerPlay from '@tabler/icons-svelte/icons/player-play';
	import IconKey from '@tabler/icons-svelte/icons/key';
	import IconStack2 from '@tabler/icons-svelte/icons/stack-2';
	import IconGauge from '@tabler/icons-svelte/icons/gauge';
	import IconWebhook from '@tabler/icons-svelte/icons/webhook';
	import IconAlertTriangle from '@tabler/icons-svelte/icons/alert-triangle';
	import IconShieldCheck from '@tabler/icons-svelte/icons/shield-check';
	import Samples from '$lib/Samples.svelte';
	import { CopyButton, toast } from '@cyka/ui';
	import { language, recall } from '$lib/language.svelte';

	let { data } = $props();

	$effect(() => {
		recall();
	});

	const showing = $derived(data.first.find((f) => f.id === language.chosen) ?? data.first[0]);

	const CARDS = [
		{
			href: '/docs/authorising',
			icon: IconKey,
			title: 'Four ways to hold a token',
			text: 'Client credentials for a bot, PKCE for an app with people in it, the device flow for a TV, and a token you already have. The libraries renew it for you.'
		},
		{
			href: '/docs/paging',
			icon: IconStack2,
			title: 'Every row, without the loop',
			text: 'Each library walks a list for you, and stops on a short page rather than on a total that moved while it was being read.'
		},
		{
			href: '/docs/rate-limits',
			icon: IconGauge,
			title: 'It tells you how much is left',
			text: 'Three headers on every answer, Retry-After on the refusal. The libraries wait exactly as long as the server asked.'
		},
		{
			href: '/docs/webhooks',
			icon: IconWebhook,
			title: 'Or it tells you first',
			text: 'Seven signed events — an episode airing, a list moving, a post, a follow — queued and retried for a day.'
		},
		{
			href: '/docs/errors',
			icon: IconAlertTriangle,
			title: 'One error type per refusal',
			text: 'A phrase name, never a sentence, so every library has a real type to catch instead of a string to match.'
		},
		{
			href: '/docs/scopes',
			icon: IconShieldCheck,
			title: `${data.counts.scopes} scopes, each honoured`,
			text: 'A scope exists from the day something checks it. Ask for what you use and the consent screen stays short.'
		}
	];
</script>

<svelte:head>
	<title>acyka for developers — the anime catalogue and people's lists, behind a token</title>
	<meta
		name="description"
		content="The acyka API: {data.counts.operations} operations over the anime catalogue, public profiles and one account's lists and writing. Client libraries in six languages, generated from one contract."
	/>
	<meta property="og:title" content="acyka for developers" />
	<meta
		property="og:description"
		content="{data.counts.operations} operations, six client libraries, one contract."
	/>
</svelte:head>

<div class="front">
	<section class="hero">
		<div class="glow" aria-hidden="true"></div>

		<div class="say">
			<a class="pill" href="/docs/libraries">
				<span class="dot"></span>
				Six client libraries, one contract
				<IconArrowRight size={14} stroke={2} />
			</a>
			<h1>
				Build on the anime catalogue <span class="soft">and the lists people keep in it.</span>
			</h1>
			<p class="lede">
				{data.counts.operations} operations over titles, characters, people and schedules — and, with a
				person's consent, their lists, shelves and writing. The same functions acyka's own site calls,
				so what you read is what it reads.
			</p>

			<div class="doors">
				<a class="primary" href="/docs">
					Get started <IconArrowRight size={16} stroke={2} />
				</a>
				<a class="secondary" href="/reference">
					<IconCode size={16} stroke={1.8} /> API reference
				</a>
			</div>

			{#if showing}
				<div class="install">
					<span class="prompt" aria-hidden="true">$</span>
					<code>{showing.install}</code>
					<CopyButton value={showing.install} onfail={() => toast('could not copy', 'error')} />
				</div>
			{/if}
		</div>

		<div class="show">
			<Samples samples={data.first} />
		</div>
	</section>

	<section class="numbers" aria-label="At a glance">
		<a href="/reference"><strong>{data.counts.operations}</strong><span>operations</span></a>
		<a href="/reference"><strong>{data.counts.models}</strong><span>shapes</span></a>
		<a href="/docs/libraries"><strong>6</strong><span>languages</span></a>
		<a href="/docs/scopes"><strong>{data.counts.scopes}</strong><span>scopes</span></a>
	</section>

	<section class="cards">
		<header>
			<h2>The parts that usually bite, already handled</h2>
			<p>
				The types and methods are generated from the server's own contract. The rest — the token, the
				waiting, the paging, the errors — is written by hand in each language, because that is the half
				that decides whether a client is pleasant.
			</p>
		</header>

		<div class="grid">
			{#each CARDS as card (card.href)}
				{@const Icon = card.icon}
				<a class="card" href={card.href}>
					<span class="mark"><Icon size={20} stroke={1.7} /></span>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
					<span class="more">Read the guide <IconArrowRight size={14} stroke={2} /></span>
				</a>
			{/each}
		</div>
	</section>

	<section class="three">
		<a class="big" href="/docs">
			<IconBook size={22} stroke={1.6} />
			<h3>Guides</h3>
			<p>From registering an application to the first call in about two minutes, then everything after it.</p>
		</a>
		<a class="big" href="/reference">
			<IconCode size={22} stroke={1.6} />
			<h3>Reference</h3>
			<p>Every operation with the call in seven languages, an example answer, and every shape inside it.</p>
		</a>
		<a class="big" href="/playground">
			<IconPlayerPlay size={22} stroke={1.6} />
			<h3>Playground</h3>
			<p>Sign in and call the live api from this tab — the same request your own application will make.</p>
		</a>
	</section>
</div>

<style>
	.front {
		display: flex;
		flex-direction: column;
		gap: var(--s-12);
		width: 100%;
		max-width: 76rem;
		margin: 0 auto;
		padding: var(--s-8) var(--s-4) var(--s-12);
	}

	/* --- the hero ------------------------------------------------------------ */

	.hero {
		position: relative;
		display: grid;
		gap: var(--s-8);
		align-items: center;
	}

	.glow {
		position: absolute;
		inset: -160px -20% auto;
		height: 520px;
		z-index: -1;
		background:
			radial-gradient(ellipse 40% 50% at 30% 40%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%),
			radial-gradient(ellipse 35% 45% at 75% 30%, color-mix(in oklab, var(--verb-get) 14%, transparent), transparent 70%);
		filter: blur(20px);
		pointer-events: none;
	}

	.say {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 0;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
		padding: 5px 12px 5px 10px;
		border: 1px solid var(--border);
		border-radius: var(--r-full);
		background: color-mix(in oklab, var(--surface) 60%, transparent);
		color: var(--text-2);
		font-size: 13px;
		font-weight: 500;
		text-decoration: none;
		transition: border-color var(--t) var(--ease);
	}

	.pill:hover {
		border-color: var(--border-strong);
		color: var(--text-title);
		text-decoration: none;
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--verb-post);
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--verb-post) 25%, transparent);
	}

	h1 {
		margin: var(--s-4) 0 0;
		font-size: clamp(2.3rem, 5.2vw, 3.6rem);
		font-weight: 750;
		line-height: 1.04;
		letter-spacing: -0.045em;
		color: var(--text-title);
		text-wrap: balance;
	}

	.soft {
		color: var(--text-muted);
	}

	.lede {
		max-width: 36rem;
		margin: var(--s-4) 0 0;
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--text-2);
		text-wrap: pretty;
	}

	.doors {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-2);
		margin-top: var(--s-6);
	}

	.doors a {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
		height: 44px;
		padding: 0 18px;
		border-radius: 12px;
		font-size: 15px;
		font-weight: 600;
		text-decoration: none;
		transition: background var(--t) var(--ease), transform var(--t) var(--ease);
	}

	.doors a:hover {
		text-decoration: none;
	}

	.doors a:active {
		transform: scale(0.98);
	}

	.primary {
		background: var(--accent);
		color: #fff !important;
		box-shadow: 0 6px 24px -8px color-mix(in oklab, var(--accent) 70%, transparent);
	}

	.primary:hover {
		background: var(--accent-hover);
	}

	.secondary {
		border: 1px solid var(--border-strong);
		background: color-mix(in oklab, var(--surface) 50%, transparent);
		color: var(--text-title) !important;
	}

	.secondary:hover {
		background: var(--surface-2);
	}

	.install {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
		max-width: 100%;
		margin-top: var(--s-4);
		padding: 4px 4px 4px 14px;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--code-bg);
		font-family: var(--font-mono);
		font-size: 13px;
	}

	.install code {
		color: var(--text-title);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.prompt {
		color: var(--text-muted);
	}

	.show {
		min-width: 0;
		border-radius: var(--r-md);
		box-shadow: 0 30px 80px -30px #000a;
	}

	:global(:root[data-theme='light']) .show {
		box-shadow: 0 30px 80px -40px #17172440;
	}

	.show :global(pre) {
		min-height: 18rem;
	}

	/* --- the numbers --------------------------------------------------------- */

	.numbers {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		overflow: hidden;
	}

	.numbers a {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: var(--s-4) var(--s-6);
		border-right: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		transition: background var(--t) var(--ease);
	}

	.numbers a:hover {
		background: var(--hover);
		text-decoration: none;
	}

	.numbers strong {
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--text-title);
	}

	.numbers span {
		font-size: 13px;
		color: var(--text-muted);
	}

	/* --- the cards ----------------------------------------------------------- */

	.cards header {
		max-width: 40rem;
		margin-bottom: var(--s-6);
	}

	h2 {
		margin: 0;
		font-size: clamp(1.5rem, 2.6vw, 2rem);
		letter-spacing: -0.03em;
		line-height: 1.15;
		color: var(--text-title);
	}

	.cards header p {
		margin: var(--s-3) 0 0;
		line-height: 1.65;
		color: var(--text-2);
	}

	.grid {
		display: grid;
		gap: var(--s-3);
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
		padding: var(--s-6);
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		background: color-mix(in oklab, var(--surface) 35%, transparent);
		text-decoration: none;
		transition: border-color var(--t) var(--ease), background var(--t) var(--ease), transform var(--t) var(--ease);
	}

	.card:hover {
		border-color: color-mix(in oklab, var(--accent) 45%, var(--border));
		background: color-mix(in oklab, var(--surface) 60%, transparent);
		text-decoration: none;
		transform: translateY(-2px);
	}

	.mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		margin-bottom: var(--s-2);
		border-radius: 11px;
		background: color-mix(in oklab, var(--accent) 14%, transparent);
		color: var(--accent-hover);
	}

	:global(:root[data-theme='light']) .mark {
		color: var(--accent-text);
	}

	h3 {
		margin: 0;
		font-size: 1.05rem;
		letter-spacing: -0.01em;
		color: var(--text-title);
	}

	.card p,
	.big p {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--text-2);
	}

	.more {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: auto;
		padding-top: var(--s-2);
		font-size: 13px;
		font-weight: 600;
		color: var(--accent-hover);
	}

	:global(:root[data-theme='light']) .more {
		color: var(--accent-text);
	}

	/* --- the three doors ----------------------------------------------------- */

	.three {
		display: grid;
		gap: var(--s-3);
	}

	.big {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
		padding: var(--s-6);
		border-radius: var(--r-lg);
		background: linear-gradient(
			160deg,
			color-mix(in oklab, var(--accent) 12%, var(--surface)) 0%,
			color-mix(in oklab, var(--surface) 50%, transparent) 70%
		);
		border: 1px solid var(--border);
		color: var(--text-title);
		text-decoration: none;
		transition: transform var(--t) var(--ease), border-color var(--t) var(--ease);
	}

	.big:hover {
		transform: translateY(-2px);
		border-color: color-mix(in oklab, var(--accent) 45%, var(--border));
		text-decoration: none;
	}

	@media (min-width: 640px) {
		.numbers {
			grid-template-columns: repeat(4, 1fr);
		}

		.numbers a {
			border-bottom: 0;
		}

		.numbers a:last-child {
			border-right: 0;
		}

		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 639px) {
		.numbers a:nth-child(2n) {
			border-right: 0;
		}

		.numbers a:nth-child(n + 3) {
			border-bottom: 0;
		}
	}

	@media (min-width: 980px) {
		.front {
			padding: var(--s-12) var(--s-6);
		}

		.hero {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
			gap: var(--s-12);
			min-height: 30rem;
		}

		.grid,
		.three {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.big,
		.doors a {
			transition: none;
		}

		.card:hover,
		.big:hover {
			transform: none;
		}
	}
</style>
