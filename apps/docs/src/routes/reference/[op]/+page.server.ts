import { error } from '@sveltejs/kit';
import { bySlug, contract, groups } from '$lib/server/contract';
import { exampleJson } from '$lib/server/example';
import { spoken } from '$lib/server/nav';
import { slug } from '$lib/slug';
import { coloured } from '$lib/server/highlight';
import { samples } from '$lib/server/samples';
import { links } from '$lib/type';
import type { Model, Ty } from '$tools/spec';

/**
 * One operation, with every shape it mentions.
 *
 * The shapes are gathered transitively and rendered on the same page rather than
 * linked away to a page of their own, because reading a reference is reading a
 * shape and the shapes it contains — and three clicks to find out what a `Voice`
 * is, is how a reference stops being read.
 */
export async function load({ params }) {
	const op = bySlug(params.op);
	if (!op) error(404, 'there is no operation at that address');

	const api = contract();
	const found = new Map<string, Model>();

	const walk = (t: Ty | null | undefined) => {
		const name = t ? links(t) : undefined;
		if (!name || found.has(name)) return;
		const model = api.models.find((m) => m.name === name);
		if (!model) return;
		found.set(name, model);
		for (const field of model.fields) walk(field.ty);
	};

	walk(op.ok.ty);
	if (op.body) {
		const body = api.models.find((m) => m.name === op.body!.model);
		if (body) {
			found.set(body.name, body);
			for (const field of body.fields) walk(field.ty);
		}
	}

	const written = samples(op);

	// the operations either side of this one in its group, for the doors at the bottom
	const all = groups().flatMap((g) => g.ops);
	const at = all.findIndex((one) => one.id === op.id);
	const door = (one: (typeof all)[number] | undefined) =>
		one && { href: `/reference/${slug(one.id)}`, label: spoken(one.id), verb: one.method };

	const answer = op.ok.ty ? exampleJson(api, op.ok.ty) : undefined;

	return {
		op,
		title: spoken(op.id),
		prev: door(all[at - 1]),
		next: door(all[at + 1]),
		answer: answer && { code: answer, html: await coloured(answer, 'json') },
		shapes: [...found.values()],
		samples: await Promise.all(
			written.map(async (sample) => ({
				...sample,
				html: await coloured(sample.code, sample.id === 'curl' ? 'bash' : sample.id)
			}))
		)
	};
}
