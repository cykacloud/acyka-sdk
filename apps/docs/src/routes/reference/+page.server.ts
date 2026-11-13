import { contract, groups } from '$lib/server/contract';
import { spoken, address } from '$lib/server/nav';
import { slug } from '$lib/slug';

/** Every group, and every operation in it, ready to draw — no contract in the browser. */
export function load() {
	const api = contract();
	return {
		counts: { operations: api.ops.length, models: api.models.length },
		groups: groups().map((group) => ({
			tag: group.tag,
			doc: group.doc,
			ops: group.ops.map((op) => ({
				href: `/reference/${slug(op.id)}`,
				label: spoken(op.id),
				verb: op.method,
				address: address(op),
				summary: op.summary ?? '',
				scope: op.scope
			}))
		}))
	};
}
