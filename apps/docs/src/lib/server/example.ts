/**
 * What an answer looks like, made up from its shape.
 *
 * Generated rather than captured, for the reason the samples are: forty-three
 * captured answers are forty-three things that go stale the day a field is
 * added. A value is chosen by the field's name where the name says what it is
 * (`title`, `year`, `poster`), and by its type where it does not — so the
 * example reads like acyka rather than like `"string"` forty times.
 *
 * Every field is shown, the optional ones included: an example is where a
 * reader learns what *can* arrive, and the shapes list below says which ones
 * may not.
 */

import type { Api, Ty } from '$tools/spec';

const STRINGS: [RegExp, string][] = [
	[/^(title|name_romaji|romaji)$/, 'Sousou no Frieren'],
	[/^title_(en|english)$/, "Frieren: Beyond Journey's End"],
	[/^title_(ru|russian)$/, 'Провожающая в последний путь Фрирен'],
	[/^(nickname|nick|login|username)$/, 'someone'],
	[/name$/, 'Frieren'],
	[/(poster|image|avatar|banner|picture|cover|url|link|href)$/, 'https://acyka.cc/p/52991.webp'],
	[/(^|_)(at|date|time|until|since)$|_at$/, '2026-11-13T09:00:00Z'],
	[/^(lang|language|locale)$/, 'en'],
	[/^status$/, 'watching'],
	[/^kind$/, 'tv'],
	[/^(genre|genres)$/, 'Drama'],
	[/^(role)$/, 'Main'],
	[/(text|body|bio|description|about|comment|note)$/, 'A quiet one, and better for it.'],
	[/^(season)$/, 'fall_2023'],
	[/^(slug)$/, 'sousou-no-frieren'],
	[/^(code)$/, 'AbCdEf'],
	[/^(scope)$/, 'catalog:read'],
	[/^(country)$/, 'JP'],
	[/^(source)$/, 'manga']
];

const INTS: [RegExp, number][] = [
	[/^(shikimori_id|anime_id|title_id)$/, 52991],
	[/(^|_)id$/, 52991],
	[/^year$/, 2023],
	[/^(episodes|episodes_total)$/, 28],
	[/^(episodes_aired|episode|progress)$/, 28],
	[/^(duration|minutes)$/, 24],
	[/^(total|count)$|_count$/, 1284],
	[/^(rank|position|order)$/, 1],
	[/^(score|rating)$/, 10],
	[/^(age|limit)$/, 30]
];

function stringFor(name: string): string {
	for (const [re, value] of STRINGS) if (re.test(name)) return value;
	return name.replace(/_/g, ' ');
}

function intFor(name: string): number {
	for (const [re, value] of INTS) if (re.test(name)) return value;
	return 1;
}

export function example(api: Api, ty: Ty | null, name = '', depth = 0, seen: string[] = []): unknown {
	if (!ty) return null;
	switch (ty.k) {
		case 'string':
			return stringFor(name);
		case 'int':
			return intFor(name);
		case 'float':
			return /score|rating/.test(name) ? 9.31 : 1.5;
		case 'bool':
			return !/^(is_)?(adult|nsfw|hidden|private|banned|deleted)$/.test(name);
		case 'unknown':
			return {};
		case 'array':
			return depth > 3 ? [] : [example(api, ty.of, name, depth + 1, seen)];
		case 'page':
			return { items: [example(api, ty.of, name, depth + 1, seen)], total: 1284 };
		case 'ref': {
			const alias = api.aliases.find((a) => a.name === ty.name);
			if (alias) return example(api, alias.ty, name, depth, seen);
			const model = api.models.find((m) => m.name === ty.name);
			// a shape inside itself (a reply that has replies) stops after one turn
			if (!model || seen.includes(ty.name) || depth > 4) return {};
			const out: Record<string, unknown> = {};
			for (const field of model.fields) {
				out[field.name] = example(api, field.ty, field.name, depth + 1, [...seen, ty.name]);
			}
			return out;
		}
	}
}

/** The same, as the JSON a reader would see. */
export const exampleJson = (api: Api, ty: Ty | null) => JSON.stringify(example(api, ty), null, 2);
