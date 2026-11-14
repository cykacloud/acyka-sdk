<script lang="ts">
	/**
	 * One operation: what it is for and what it takes on the left, the call and
	 * what comes back on the right, held in view while the left is read.
	 *
	 * Two columns because a reference is read with one eye on the words and one
	 * on the code — and a page that puts the code after the words makes the
	 * reader scroll between them to compare a parameter with the line it is on.
	 * Under 1180px they stack, code first after the summary, because that is
	 * what most visitors came for.
	 */
	import Fields from '$lib/Fields.svelte';
	import Samples from '$lib/Samples.svelte';
	import Code from '$lib/Code.svelte';
	import { LANGUAGES, written, type Language } from '$lib/type';
	import { language, recall, remember } from '$lib/language.svelte';
	import { slug } from '$lib/slug';
	import { inline } from '$lib/inline';
	import IconArrowLeft from '@tabler/icons-svelte/icons/arrow-left';
	import IconArrowRight from '@tabler/icons-svelte/icons/arrow-right';
	import IconPlayerPlay from '@tabler/icons-svelte/icons/player-play';
	import IconLock from '@tabler/icons-svelte/icons/lock';
	import IconStack2 from '@tabler/icons-svelte/icons/stack-2';

	let { data } = $props();

	const op = $derived(data.op);

	$effect(() => {
		recall();
	});

	/**
	 * Which language the shapes are written in: the site's choice, where it is
	 * one of the six (curl writes no types, so a reader in curl reads
	 * TypeScript's).
	 */
	const types = $derived<Language>(
		(LANGUAGES.find((l) => l.id === language.chosen)?.id as Language) ?? 'typescript'
	);

	const paragraphs = $derived((op.doc ?? '').split('\n\n').filter(Boolean));
	const answer = $derived(op.ok.ty);
	const query = $derived(op.params.filter((p) => p.where === 'query'));
	const path = $derived(op.params.filter((p) => p.where === 'path'));
	const address = $derived(op.path.replace('/api/v1', ''));
	const drawn = $derived(data.shapes.map((s) => s.name));
</script>

<svelte:head>
	<title>{data.title} — acyka api reference</title>
	<meta name="description" content={op.summary ?? `${op.method} ${op.path}`} />
</svelte:head>

<div class="op">
	<header class="head rise">
		<p class="eyebrow">{op.tag}</p>
		<h1>{data.title}</h1>
		<div class="where">
			<span class="verb" data-verb={op.method}>{op.method}</span>
			<code>{address}</code>
		</div>
		<ul class="facts">
			{#if op.scope}
				<li>
					<IconLock size={14} stroke={1.8} />
					needs <a href="/docs/scopes#{op.scope.replace(':', '-')}"><code>{op.scope}</code></a>
				</li>
			{:else}
				<li><IconLock size={14} stroke={1.8} /> any token</li>
			{/if}
			{#if op.pages}
				<li><IconStack2 size={14} stroke={1.8} /> <a href="/docs/paging">pages</a></li>
			{/if}
			<li class="id">operation <code>{op.id}</code></li>
		</ul>
	</header>

	<div class="cols">
		<div class="words prose">
			{#if op.summary && !paragraphs.length}<p class="lede">{@html inline(op.summary)}</p>{/if}
			{#each paragraphs as text, i (i)}
				<p class:lede={i === 0}>{@html inline(text)}</p>
			{/each}

			<h2 id="asking">
				Parameters
				<a class="anchor" href="#asking" aria-label="A link to this section">#</a>
			</h2>

			{#if !op.params.length && !op.body}
				<p class="quiet">None. The address is the whole of the question.</p>
			{:else}
				<div class="langs" role="tablist" aria-label="Types written in">
					{#each LANGUAGES as one (one.id)}
						<button
							type="button"
							role="tab"
							aria-selected={one.id === types}
							onclick={() => remember(one.id)}>{one.label}</button
						>
					{/each}
				</div>

				{#if path.length}
					<h3 id="path">In the address</h3>
					<Fields
						fields={path.map((p) => ({ name: p.name, ty: p.ty, optional: false, doc: p.doc }))}
						language={types}
						asking
						{drawn}
					/>
				{/if}

				{#if query.length}
					<h3 id="query">In the query</h3>
					<Fields
						fields={query.map((p) => ({
							name: p.name,
							ty: p.ty,
							optional: !p.required,
							doc: p.doc
						}))}
						language={types}
						asking
						{drawn}
					/>
				{/if}

				{#if op.body}
					<h3 id="body">The body</h3>
					<p>
						{#if drawn.includes(op.body.model)}<a href="#shape-{op.body.model}"><code>{op.body.model}</code></a>{:else}<code>{op.body.model}</code>{/if}, sent as JSON{op.body
							.required
							? ''
							: ', and optional'}.
					</p>
				{/if}
			{/if}

			<h2 id="answer">
				Returns
				<a class="anchor" href="#answer" aria-label="A link to this section">#</a>
			</h2>

			<p class="status">
				<span class="st" class:ok={op.ok.status < 300}>{op.ok.status}</span>
				{#if answer}
					<code>{written(answer, types)}</code>
					{#if answer.k === 'page'}
						<span class="quiet">— a page: <code>items</code>, and <code>total</code> beside it</span>
					{/if}
				{:else}
					<span class="quiet">nothing — the status line carries the news</span>
				{/if}
			</p>

			{#if op.pages}
				<p>
					It pages by <code>limit</code> and <code>offset</code>, and every library has a paginator
					that walks it. Stop on a short page rather than on <code>total</code> —
					<a href="/docs/paging">Paging</a> says why.
				</p>
			{/if}

			{#if data.shapes.length}
				{#each data.shapes as shape (shape.name)}
					<section class="shape">
						<h3 id="shape-{shape.name}">
							<code>{shape.name}</code>
							<a class="anchor" href="#shape-{shape.name}" aria-label="A link to this shape">#</a>
						</h3>
						{#each (shape.doc ?? '').split('\n\n').filter(Boolean) as text, i (i)}
							<p>{@html inline(text)}</p>
						{/each}
						<Fields fields={shape.fields} language={types} {drawn} />
					</section>
				{/each}
			{/if}

			<h2 id="refusals">
				Errors
				<a class="anchor" href="#refusals" aria-label="A link to this section">#</a>
			</h2>

			<p>
				A refusal is <code>{'{ "message": "errors.something" }'}</code> — a phrase name, never a
				sentence, because one screen can be read in five languages. Every library turns the name into
				a type, so you catch the case you can do something about. <a href="/docs/errors">Errors</a>
				has the list; <code>401</code> and <code>403</code> are
				<a href="/docs/errors#the-distinction">not the same problem</a>.
			</p>
		</div>

		<aside class="calls rise" style="--d: 90ms">
			<div class="stick">
				<Samples samples={data.samples} label="Request" />

				{#if data.answer}
					<Code code={data.answer.code} html={data.answer.html}>
						{#snippet bar()}
							<span class="answer-bar">
								<span class="name">Response</span>
								<span class="st ok">{op.ok.status}</span>
								<span class="made">example</span>
							</span>
						{/snippet}
					</Code>
				{:else}
					<div class="empty">
						<span class="st ok">{op.ok.status}</span> No content
					</div>
				{/if}

				<a class="try" href="/playground?op={slug(op.id)}">
					<IconPlayerPlay size={15} stroke={2} />
					Try it in the playground
				</a>
			</div>
		</aside>
	</div>

	<nav class="doors" aria-label="Operations">
		{#if data.prev}
			<a class="door" href={data.prev.href}>
				<span class="dir"><IconArrowLeft size={14} stroke={2} /> Previous</span>
				<span class="what">
					<span class="verb" data-verb={data.prev.verb}>{data.prev.verb}</span>
					{data.prev.label}
				</span>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if data.next}
			<a class="door next" href={data.next.href}>
				<span class="dir">Next <IconArrowRight size={14} stroke={2} /></span>
				<span class="what">
					<span class="verb" data-verb={data.next.verb}>{data.next.verb}</span>
					{data.next.label}
				</span>
			</a>
		{/if}
	</nav>
</div>

<style>
	.op {
		max-width: 76rem;
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

	h1 {
		margin: 0;
		font-size: clamp(1.9rem, 3.4vw, 2.4rem);
		letter-spacing: -0.03em;
		line-height: 1.15;
		color: var(--text-title);
	}

	.where {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
		max-width: 100%;
		margin-top: var(--s-4);
		padding: 6px 12px 6px 6px;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--code-bg);
	}

	.where .verb {
		font-size: 11px;
		padding: 2px 8px;
	}

	.where code {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--text-title);
		overflow-wrap: anywhere;
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-2) var(--s-4);
		margin: var(--s-3) 0 0;
		padding: 0;
		list-style: none;
		font-size: 13px;
		color: var(--text-muted);
	}

	.facts li {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.facts code {
		font-family: var(--font-mono);
		font-size: 12.5px;
	}

	.cols {
		display: grid;
		gap: var(--s-8);
		margin-top: var(--s-8);
	}

	/* stacked: the code right after the summary, which is what most came for */
	.calls {
		order: -1;
		min-width: 0;
	}

	.words {
		min-width: 0;
		max-width: none;
	}

	.words > :first-child {
		margin-top: 0;
	}

	.stick {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
	}

	.langs {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.langs button {
		padding: 4px 10px;
		border: 1px solid var(--border);
		border-radius: var(--r-full);
		background: transparent;
		color: var(--text-muted);
		font: inherit;
		font-size: 12.5px;
		cursor: pointer;
	}

	.langs button:hover {
		color: var(--text-title);
		border-color: var(--border-strong);
	}

	.langs button[aria-selected='true'] {
		color: var(--text-title);
		border-color: color-mix(in oklab, var(--accent) 60%, var(--border));
		background: color-mix(in oklab, var(--accent) 12%, transparent);
	}

	.lede {
		font-size: 1.075rem;
		color: var(--text-2) !important;
	}

	.quiet {
		color: var(--text-muted) !important;
	}

	.status {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--s-2);
	}

	.st {
		display: inline-flex;
		align-items: center;
		padding: 1px 7px;
		border-radius: 6px;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 700;
		color: var(--verb-post);
		background: color-mix(in oklab, var(--verb-post) 14%, transparent);
	}

	.shape {
		margin-top: var(--s-6);
	}

	.answer-bar {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
	}

	.answer-bar .name {
		font-size: 12px;
		font-weight: 600;
		color: var(--text-2);
	}

	.made {
		font-size: 11.5px;
		color: var(--text-muted);
	}

	.calls :global(figure:last-of-type pre) {
		max-height: 34rem;
	}

	.empty {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		padding: var(--s-3) var(--s-4);
		border: 1px dashed var(--border-strong);
		border-radius: var(--r-md);
		color: var(--text-muted);
		font-size: 14px;
	}

	.try {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--s-2);
		height: 40px;
		border: 1px solid color-mix(in oklab, var(--accent) 45%, var(--border));
		border-radius: 10px;
		background: color-mix(in oklab, var(--accent) 10%, transparent);
		color: var(--text-title);
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		transition: background var(--t) var(--ease);
	}

	.try:hover {
		background: color-mix(in oklab, var(--accent) 18%, transparent);
		text-decoration: none;
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
		gap: 6px;
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

	.door.next {
		grid-column: 2;
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
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
		font-weight: 600;
		color: var(--text-title);
	}

	@media (min-width: 1180px) {
		.cols {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: var(--s-12);
		}

		.calls {
			order: 0;
		}

		.stick {
			position: sticky;
			top: calc(var(--top-h) + var(--s-6));
			max-height: calc(100dvh - var(--top-h) - var(--s-8));
			overflow-y: auto;
			scrollbar-width: none;
		}
	}

	@media (max-width: 560px) {
		.doors {
			grid-template-columns: 1fr;
		}

		.door.next {
			grid-column: 1;
		}
	}
</style>
