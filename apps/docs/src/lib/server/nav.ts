/**
 * The rail and the search index, built from the contract where they can be.
 *
 * The reference half is every tag and every operation the document declares, so
 * an endpoint the server grows appears in the rail and in ⌘K without anybody
 * editing a file, and one it drops disappears with it.
 *
 * Server-only, and the directory says so: this reads the whole contract, and
 * the layout that draws the rail runs in the browser too. It is handed the
 * finished lists by `+layout.server.ts` — a few kilobytes of links rather than
 * the document they were derived from.
 */

import { contract, groups as tags } from './contract';
import { slug } from '../slug';
import { GUIDES, type Found, type Group } from '../nav';
import type { Op } from '$tools/spec';

/** `listTitles` as somebody would say it: "List titles". */
export function spoken(id: string): string {
	const words = id.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
	return words.charAt(0).toUpperCase() + words.slice(1);
}

/** The address a reader writes, without the prefix every one of them shares. */
export const address = (op: Op) => op.path.replace('/api/v1', '');

export function sidebar(): Group[] {
	return [
		{ label: 'Guides', links: GUIDES.map(({ href, label }) => ({ href, label })) },
		...tags().map((group) => ({
			label: group.tag,
			links: group.ops.map((op) => ({
				href: `/reference/${slug(op.id)}`,
				label: spoken(op.id),
				hint: address(op),
				verb: op.method
			}))
		}))
	];
}

/**
 * Everything ⌘K can find.
 *
 * Guides and their sections, every operation, and every shape — a shape is
 * found by name and opens on the first operation that answers with it, which is
 * where the reference draws it.
 */
export function index(): Found[] {
	const api = contract();
	const found: Found[] = [];

	for (const guide of GUIDES) {
		found.push({ href: guide.href, label: guide.label, kind: 'guide', hint: guide.lede });
		for (const section of guide.sections) {
			found.push({
				href: `${guide.href}#${section.id}`,
				label: section.label,
				kind: 'section',
				hint: guide.label
			});
		}
	}

	for (const op of api.ops) {
		found.push({
			href: `/reference/${slug(op.id)}`,
			label: spoken(op.id),
			kind: 'operation',
			hint: address(op),
			verb: op.method,
			words: [op.id, op.tag, op.summary ?? '', op.scope ?? ''].join(' ')
		});
	}

	// a shape opens where it is drawn: on an operation that mentions it
	const home = new Map<string, string>();
	// transitively, the way the reference page gathers the shapes it draws
	const mentions = (op: Op): string[] => {
		const names = new Set<string>();
		const walk = (t: Op['ok']['ty']) => {
			if (!t) return;
			if (t.k === 'array' || t.k === 'page') return walk(t.of);
			if (t.k !== 'ref' || names.has(t.name)) return;
			names.add(t.name);
			for (const field of api.models.find((m) => m.name === t.name)?.fields ?? []) walk(field.ty);
		};
		walk(op.ok.ty);
		if (op.body) walk({ k: 'ref', name: op.body.model });
		return [...names];
	};
	for (const op of api.ops) {
		for (const name of mentions(op)) if (!home.has(name)) home.set(name, slug(op.id));
	}
	for (const model of api.models) {
		const at = home.get(model.name);
		if (!at) continue;
		found.push({
			href: `/reference/${at}#shape-${model.name}`,
			label: model.name,
			kind: 'shape',
			hint: model.fields
				.slice(0, 4)
				.map((f) => f.name)
				.join(', ')
		});
	}

	return found;
}
