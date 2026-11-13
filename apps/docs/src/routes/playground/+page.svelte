<script lang="ts">
	/**
	 * The same api, from a browser, signed in as whoever is reading.
	 *
	 * **It talks to the live api directly.** No proxy on this server, and that is
	 * the whole point: every request from this page is a cross-site request from a
	 * browser carrying a bearer token, which is exactly what a reader's own
	 * single-page application will make. If the api's CORS rule ever stops
	 * allowing that, it breaks here — on the site that documents it — rather than
	 * in somebody's project a month later.
	 *
	 * Writes are marked and are real. There is no sandbox: a token acts for an
	 * account, and pretending otherwise would be a playground that teaches the
	 * wrong thing about what a token can do.
	 */
	import { page } from '$app/state';
	import { Button, CopyButton, Input, Search, TextArea, toast } from '@cyka/ui';
	import IconSearch from '@tabler/icons-svelte/icons/search';
	import IconPlayerPlay from '@tabler/icons-svelte/icons/player-play';
	import IconAlertTriangle from '@tabler/icons-svelte/icons/alert-triangle';
	import IconLock from '@tabler/icons-svelte/icons/lock';
	import IconUserCircle from '@tabler/icons-svelte/icons/user-circle';
	import IconBook from '@tabler/icons-svelte/icons/book-2';
	import Code from '$lib/Code.svelte';
	import { ASKING, send, signed, type Answer } from '$lib/auth.svelte';

	let { data } = $props();

	type Op = (typeof data.ops)[number];

	let filter = $state('');
	let chosen = $state<Op | undefined>(undefined);
	let values = $state<Record<string, string>>({});
	let body = $state('{\n  \n}');
	let answer = $state<Answer | null>(null);
	let running = $state(false);
	let failed = $state('');

	/** The operation named in `?op=`, so a reference page can link straight here. */
	$effect(() => {
		const asked = page.url.searchParams.get('op');
		if (!asked || chosen) return;
		const found = data.ops.find((op) => op.slug === asked);
		if (found) pick(found);
	});

	const showing = $derived.by(() => {
		const asked = filter.trim().toLowerCase();
		const all = data.ops;
		if (!asked) return all;
		return all.filter(
			(op) =>
				op.id.toLowerCase().includes(asked) ||
				op.label.toLowerCase().includes(asked) ||
				op.path.toLowerCase().includes(asked) ||
				op.summary.toLowerCase().includes(asked)
		);
	});

	function pick(op: Op) {
		chosen = op;
		answer = null;
		failed = '';
		// every field starts as an empty string: the kit's `Input` has a fallback
		// value, and binding it to `undefined` is an error in Svelte 5
		values = Object.fromEntries(op.params.map((p) => [p.name, '']));
		body = '{\n  \n}';
	}

	/** The address as it stands, so a reader can see what they are about to send. */
	const url = $derived.by(() => {
		if (!chosen) return '';
		let path = chosen.path;
		for (const p of chosen.params.filter((x) => x.where === 'path')) {
			path = path.replace(`{${p.name}}`, encodeURIComponent(values[p.name] ?? `{${p.name}}`));
		}
		const query = chosen.params
			.filter((p) => p.where === 'query' && (values[p.name] ?? '') !== '')
			.map((p) => `${p.name}=${encodeURIComponent(values[p.name]!)}`)
			.join('&');
		return `https://api.acyka.cc${path}${query ? `?${query}` : ''}`;
	});

	const ready = $derived.by(() => {
		if (!chosen) return false;
		return chosen.params
			.filter((p) => p.required)
			.every((p) => (values[p.name] ?? '').trim() !== '');
	});

	async function run() {
		if (!chosen || running) return;
		running = true;
		failed = '';
		answer = null;

		let path = chosen.path;
		for (const p of chosen.params.filter((x) => x.where === 'path')) {
			path = path.replace(`{${p.name}}`, values[p.name] ?? '');
		}
		const query: Record<string, string> = {};
		for (const p of chosen.params.filter((x) => x.where === 'query')) {
			const value = values[p.name] ?? '';
			if (value !== '') query[p.name] = value;
		}

		try {
			answer = await send(
				chosen.method,
				path,
				query,
				chosen.body ? body : undefined
			);
		} catch (err) {
			// A cross-site request the browser refused never reaches a status, and
			// the message it gives is deliberately vague — so this says where to
			// look rather than repeating it.
			failed =
				err instanceof TypeError
					? 'the browser would not send that — the console has the reason, and it is usually CORS or a blocked network'
					: err instanceof Error
						? err.message
						: 'something went wrong';
		} finally {
			running = false;
		}
	}

	const shown = $derived(answer ? JSON.stringify(answer.body, null, 2) : '');

	/** the list, grouped by what each operation is about */
	const grouped = $derived.by(() => {
		const by = new Map<string, Op[]>();
		for (const op of showing) {
			if (!by.has(op.tag)) by.set(op.tag, []);
			by.get(op.tag)!.push(op);
		}
		return [...by.entries()].map(([tag, ops]) => ({ tag, ops }));
	});

	/** the request as a curl line, for the reader who wants to take it away */
	const asCurl = $derived(
		chosen
			? `curl -X ${chosen.method} '${url}' \\\n  -H "Authorization: Bearer $ACYKA_TOKEN"` +
					(chosen.body ? ` \\\n  -H 'content-type: application/json' \\\n  -d '${body.replace(/'/g, "'\\''")}'` : '')
			: ''
	);

	const tone = (status: number) => (status < 300 ? 'ok' : status < 500 ? 'no' : 'bad');
</script>

<svelte:head>
	<title>Playground — acyka api</title>
	<meta
		name="description"
		content="Call the live acyka API from your browser, signed in as yourself."
	/>
</svelte:head>

<div class="ground">
	<header class="intro rise">
		<div>
			<p class="eyebrow">Playground</p>
			<h1>Call the live api, as you</h1>
			<p class="lede">
				Every request here is the cross-site request your own single-page application will make —
				from this tab, with your token, and no proxy in between.
			</p>
		</div>

		<div class="who" class:in={signed.in}>
			<span class="avatar"><IconUserCircle size={22} stroke={1.6} /></span>
			{#if signed.in}
				<div class="words">
					<strong>Signed in</strong>
					<span class="scopes">
						{#each signed.scopes as scope (scope)}<code>{scope}</code>{/each}
					</span>
				</div>
				<Button size="sm" variant="ghost" onclick={() => signed.out()}>Sign out</Button>
			{:else}
				<div class="words">
					<strong>Not signed in</strong>
					<span>Every route needs a token. It lasts an hour.</span>
				</div>
				<Button size="sm" onclick={() => signed.start(page.url.pathname + page.url.search)}>
					Sign in with acyka
				</Button>
			{/if}
		</div>
	</header>

	<div class="split">
		<aside class="list">
			<Search bind:value={filter} placeholder="Filter operations" label="Filter the operations">
				{#snippet icon()}<IconSearch size={16} stroke={1.7} />{/snippet}
			</Search>

			<div class="ops">
				{#each grouped as group (group.tag)}
					<p class="tag">{group.tag}</p>
					{#each group.ops as op (op.id)}
						<button
							type="button"
							class:on={chosen?.id === op.id}
							aria-pressed={chosen?.id === op.id}
							onclick={() => pick(op)}
						>
							<span class="verb" data-verb={op.method}>{op.method}</span>
							<span class="label">{op.label}</span>
						</button>
					{/each}
				{/each}
				{#if grouped.length === 0}
					<p class="none">Nothing matches “{filter}”.</p>
				{/if}
			</div>
		</aside>

		<div class="work">
			{#if !chosen}
				<div class="pick">
					<IconPlayerPlay size={28} stroke={1.4} />
					<p><strong>Pick an operation</strong></p>
					<p>Choose one on the left, fill in what it asks for, and send it.</p>
				</div>
			{:else}
				<div class="card rise">
					<div class="title">
						<h2>{chosen.label}</h2>
						<a class="ref" href="/reference/{chosen.slug}"><IconBook size={14} stroke={1.8} /> Reference</a>
					</div>
					{#if chosen.summary}<p class="says">{chosen.summary}</p>{/if}

					<div class="address">
						<span class="verb" data-verb={chosen.method}>{chosen.method}</span>
						<code>{url.replace('https://api.acyka.cc', '')}</code>
					</div>

					<div class="facts">
						{#if chosen.scope}
							<span class="fact"><IconLock size={13} stroke={1.8} /> <code>{chosen.scope}</code></span>
							{#if signed.in && !signed.carries(chosen.scope)}
								<span class="fact warn">
									<IconAlertTriangle size={13} stroke={1.8} /> not granted — this will answer 403
								</span>
							{/if}
						{/if}
					</div>

					{#if chosen.writes}
						<p class="real">
							<IconAlertTriangle size={16} stroke={1.8} />
							<span>This one writes, for real — there is no sandbox. It will change your own account.</span>
						</p>
					{/if}

					{#if chosen.params.length}
						<div class="params">
							{#each chosen.params as param (param.name)}
								<label>
									<span class="name">
										<code>{param.name}</code>
										<small>{param.where === 'path' ? 'path' : 'query'}</small>
										{#if param.required}<em>required</em>{/if}
									</span>
									<Input
										bind:value={values[param.name]}
										placeholder={param.kind === 'string' ? 'text' : 'a number'}
										hint={param.doc}
									/>
								</label>
							{/each}
						</div>
					{/if}

					{#if chosen.body}
						<label class="body">
							<span class="name">
								<code>{chosen.body}</code>
								<small>body, as JSON</small>
							</span>
							<TextArea bind:value={body} rows={7} />
						</label>
					{/if}

					<div class="going">
						<span class="state">
							{#if !signed.in}Sign in first.{:else if !ready}Fill in what is required.{:else}Ready.{/if}
						</span>
						<CopyButton value={asCurl} onfail={() => toast('could not copy', 'error')} />
						<Button disabled={!ready || running || !signed.in} loading={running} onclick={run}>
							<span class="go"><IconPlayerPlay size={15} stroke={1.9} /> Send</span>
						</Button>
					</div>
				</div>

				{#if failed}
					<p class="failed">{failed}</p>
				{/if}

				{#if answer}
					<div class="answer rise">
						<Code code={shown}>
							{#snippet bar()}
								<span class="line">
									<span class="st {tone(answer!.status)}">{answer!.status}</span>
									<span>{answer!.took} ms</span>
									{#if answer!.pace.remaining}
										<span class="pace">
											{answer!.pace.remaining}/{answer!.pace.limit} left · resets in {answer!.pace.reset}s
										</span>
									{/if}
								</span>
							{/snippet}
						</Code>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.ground {
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
		width: 100%;
		max-width: 88rem;
		margin: 0 auto;
		padding: var(--s-6) var(--s-4) var(--s-12);
	}

	.intro {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--s-4);
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
		font-size: clamp(1.8rem, 3.2vw, 2.3rem);
		letter-spacing: -0.03em;
		color: var(--text-title);
	}

	.lede {
		max-width: 38rem;
		margin: var(--s-2) 0 0;
		line-height: 1.6;
		color: var(--text-2);
	}

	.who {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		max-width: 100%;
		padding: var(--s-2) var(--s-2) var(--s-2) var(--s-3);
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		background: color-mix(in oklab, var(--surface) 45%, transparent);
	}

	.who.in {
		border-color: color-mix(in oklab, var(--verb-post) 40%, var(--border));
	}

	.avatar {
		display: inline-flex;
		color: var(--text-muted);
	}

	.who.in .avatar {
		color: var(--verb-post);
	}

	.who .words {
		display: flex;
		flex-direction: column;
		min-width: 0;
		font-size: 13px;
		color: var(--text-muted);
	}

	.who strong {
		color: var(--text-title);
		font-size: 14px;
	}

	.scopes {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.scopes code {
		font-family: var(--font-mono);
		font-size: 11px;
	}

	.split {
		display: grid;
		gap: var(--s-4);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
		min-width: 0;
	}

	.ops {
		display: flex;
		flex-direction: column;
		gap: 1px;
		max-height: 40vh;
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.tag {
		margin: var(--s-3) 0 var(--s-1);
		padding: 0 var(--s-2);
		font-size: 11.5px;
		font-weight: 650;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-title);
	}

	.ops button {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 6px var(--s-2);
		border: 0;
		border-radius: 8px;
		background: none;
		color: var(--text-2);
		font: inherit;
		font-size: 14px;
		text-align: left;
		cursor: pointer;
	}

	.ops button:hover {
		background: var(--hover);
		color: var(--text-title);
	}

	.ops button.on {
		background: color-mix(in oklab, var(--accent) 13%, transparent);
		color: var(--text-title);
		font-weight: 600;
	}

	.ops .verb {
		font-size: 9.5px;
	}

	.label {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.none {
		padding: var(--s-2);
		font-size: 14px;
		color: var(--text-muted);
	}

	.work {
		display: flex;
		flex-direction: column;
		gap: var(--s-4);
		min-width: 0;
	}

	.pick {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--s-1);
		min-height: 18rem;
		padding: var(--s-8);
		border: 1px dashed var(--border-strong);
		border-radius: var(--r-lg);
		color: var(--text-muted);
		text-align: center;
	}

	.pick p {
		margin: 0;
	}

	.pick strong {
		color: var(--text-title);
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
		padding: var(--s-6);
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		background: color-mix(in oklab, var(--surface) 35%, transparent);
	}

	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-3);
	}

	h2 {
		margin: 0;
		font-size: 1.35rem;
		letter-spacing: -0.02em;
		color: var(--text-title);
	}

	.ref {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 13px;
		font-weight: 550;
	}

	.says {
		margin: 0;
		line-height: 1.6;
		color: var(--text-2);
	}

	.address {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		padding: 8px 12px 8px 8px;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--code-bg);
		min-width: 0;
	}

	.address code {
		font-family: var(--font-mono);
		font-size: 13.5px;
		color: var(--text-title);
		overflow-wrap: anywhere;
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-2) var(--s-4);
	}

	.facts:empty {
		display: none;
	}

	.fact {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 13px;
		color: var(--text-muted);
	}

	.fact code {
		font-family: var(--font-mono);
		font-size: 12.5px;
	}

	.fact.warn {
		color: var(--verb-put);
	}

	.real {
		display: flex;
		gap: var(--s-2);
		margin: 0;
		padding: var(--s-3);
		border: 1px solid color-mix(in oklab, var(--verb-delete) 35%, var(--border));
		border-radius: var(--r-md);
		background: color-mix(in oklab, var(--verb-delete) 8%, transparent);
		color: var(--text);
		font-size: 14px;
	}

	.real :global(svg) {
		flex: none;
		color: var(--verb-delete);
		margin-top: 2px;
	}

	.params {
		display: grid;
		gap: var(--s-3);
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}

	.name {
		display: flex;
		align-items: baseline;
		gap: var(--s-2);
	}

	.name code {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 650;
		color: var(--text-title);
	}

	.name small {
		font-size: 11.5px;
		color: var(--text-muted);
	}

	.name em {
		font-style: normal;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--verb-put);
	}

	.going {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		padding-top: var(--s-3);
		border-top: 1px solid var(--border);
	}

	.state {
		flex: 1;
		font-size: 13px;
		color: var(--text-muted);
	}

	.go {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.failed {
		margin: 0;
		padding: var(--s-3) var(--s-4);
		border: 1px solid color-mix(in oklab, var(--verb-delete) 35%, var(--border));
		border-radius: var(--r-md);
		color: var(--verb-delete);
		font-size: 14px;
	}

	.answer :global(pre) {
		max-height: 60vh;
	}

	.line {
		display: inline-flex;
		align-items: center;
		gap: var(--s-3);
		font-size: 12.5px;
		color: var(--text-muted);
	}

	.st {
		padding: 1px 7px;
		border-radius: 6px;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 700;
	}

	.st.ok {
		color: var(--verb-post);
		background: color-mix(in oklab, var(--verb-post) 14%, transparent);
	}

	.st.no {
		color: var(--verb-put);
		background: color-mix(in oklab, var(--verb-put) 14%, transparent);
	}

	.st.bad {
		color: var(--verb-delete);
		background: color-mix(in oklab, var(--verb-delete) 14%, transparent);
	}

	@media (min-width: 900px) {
		.ground {
			padding: var(--s-8) var(--s-6) var(--s-12);
		}

		.split {
			grid-template-columns: 300px minmax(0, 1fr);
			gap: var(--s-6);
			align-items: start;
		}

		.list {
			position: sticky;
			top: calc(var(--top-h) + var(--s-4));
		}

		.ops {
			max-height: calc(100dvh - var(--top-h) - 7rem);
		}

		.params {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
