<script lang="ts">
	/**
	 * A shape's fields, as one language writes them: a list rather than a table.
	 *
	 * A three-column table is a table whose third column — the one with the
	 * words in it — gets squeezed to a ribbon on a phone. Here every field is a
	 * line with its name, its type and whether it may be missing, and what it is
	 * underneath, at whatever width there is.
	 *
	 * The wire's own name is always shown, whatever the language, because that is
	 * what a `curl` answer holds and what the reader will be looking at in their
	 * debugger. Where a language renames it — Kotlin and C# do — the renamed one
	 * is shown beside it rather than instead of it.
	 */
	import type { Field } from '$tools/spec';
	import { links, member, optional, written, type Language } from '$lib/type';
	import { inline } from '$lib/inline';

	let {
		fields,
		language,
		/** for parameters: "required" is the news, rather than "may be absent" */
		asking = false,
		/** the shapes this page draws; a type is a link only to one of them */
		drawn = []
	}: { fields: Field[]; language: Language; asking?: boolean; drawn?: string[] } = $props();

	const renames = $derived(language === 'kotlin' || language === 'csharp');
</script>

<ul class="fields">
	{#each fields as field (field.name)}
		{@const named = links(field.ty)}
		{@const shape = named && drawn.includes(named) ? named : undefined}
		{@const spelled = written(field.ty, language)}
		{@const shown = field.optional && !asking ? optional(spelled, language) : spelled}
		<li>
			<div class="line">
				<code class="name">{field.name}</code>
				{#if renames && member(field.name, language) !== field.name}
					<code class="renamed">{member(field.name, language)}</code>
				{/if}
				<code class="type">
					{#if shape}<a href="#shape-{shape}">{shown}</a>{:else}{shown}{/if}
				</code>
				{#if asking}
					<span class="flag" class:must={!field.optional}>{field.optional ? 'optional' : 'required'}</span>
				{:else if !asking && field.optional}
					<span class="flag">may be absent</span>
				{/if}
			</div>
			{#if field.doc}<p class="says">{@html inline(field.doc)}</p>{/if}
		</li>
	{/each}
</ul>

<style>
	.fields {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--border);
	}

	li {
		margin: 0 !important;
		padding: var(--s-3) 0;
		border-bottom: 1px solid var(--border);
	}

	.line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px var(--s-2);
	}

	code {
		font-family: var(--font-mono);
		font-size: 13px;
		padding: 0 !important;
		border: 0 !important;
		background: none !important;
	}

	.name {
		font-weight: 650;
		color: var(--text-title) !important;
	}

	.renamed {
		color: var(--text-muted) !important;
	}

	.renamed::before {
		content: '→ ';
	}

	.type {
		color: var(--text-muted) !important;
		font-size: 12.5px;
	}

	.type a {
		color: var(--accent-hover);
	}

	:global(:root[data-theme='light']) .type a {
		color: var(--accent-text);
	}

	.flag {
		font-size: 11.5px;
		font-weight: 550;
		color: var(--text-muted);
	}

	.flag.must {
		color: var(--verb-put);
	}

	.says :global(code) {
		font-size: 12.5px;
		padding: 0.05em 0.35em !important;
		border: 1px solid var(--border) !important;
		border-radius: 5px;
		background: var(--surface) !important;
		color: var(--text-title);
	}

	.says {
		margin: 6px 0 0 !important;
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-caption);
	}
</style>
