import { describe, expect, test } from 'bun:test';
import { inline } from './inline';

describe('inline', () => {
	test('backticks become code', () => {
		expect(inline('one of `en`, `ru`')).toBe('one of <code>en</code>, <code>ru</code>');
	});

	test('html is escaped, inside code too', () => {
		expect(inline('<b>`<i>`')).toBe('&lt;b&gt;<code>&lt;i&gt;</code>');
	});

	test('strong and links, but not inside code', () => {
		expect(inline('**must** see [Paging](/docs/paging) and `**x**`')).toBe(
			'<strong>must</strong> see <a href="/docs/paging">Paging</a> and <code>**x**</code>'
		);
	});

	test('a link to anything but http, a path or an anchor stays text', () => {
		expect(inline('[x](javascript:alert(1))')).toBe('[x](javascript:alert(1))');
	});
});
