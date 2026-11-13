/**
 * The search index's list of guide sections against the guides themselves.
 *
 * ⌘K finds a section of a guide nobody has opened, so the sections are written
 * in `nav.ts` as well as on the pages — and two lists of the same thing drift.
 * This reads every guide's source and fails when a heading id, a title or a
 * lede in one is not in the other.
 */
import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { GUIDES } from './nav';

const ROUTES = join(import.meta.dir, '..', 'routes');

const source = (href: string) =>
	readFileSync(join(ROUTES, href.replace(/^\//, ''), '+page.svelte'), 'utf8');

describe('the guides in nav.ts', () => {
	for (const guide of GUIDES) {
		test(`${guide.href} has the title, lede and sections nav.ts says`, () => {
			const page = source(guide.href);
			expect(page).toContain(`title="${guide.label}"`);
			expect(page).toContain(`lede="${guide.lede}"`);
			const ids = [...page.matchAll(/<h2 id="([^"]+)"/g)].map((m) => m[1]);
			expect(guide.sections.map((s) => s.id)).toEqual(ids);
		});
	}
});
