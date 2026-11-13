import { contract } from '$lib/server/contract';
import { first } from '$lib/server/first';

export async function load() {
	const api = contract();
	return {
		counts: {
			operations: api.ops.length,
			models: api.models.length,
			scopes: api.scopes.length
		},
		first: await first()
	};
}
