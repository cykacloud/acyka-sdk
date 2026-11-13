/**
 * The little markdown the contract's descriptions are written in: `code`,
 * **strong**, *emphasis* and [links](/somewhere). Nothing else, and everything
 * escaped first — the descriptions are ours, but a renderer that trusts its
 * input is one somebody eventually feeds a `<` to.
 */

const escape = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function inline(text: string | undefined): string {
	if (!text) return '';
	// code first, and kept out of the other rules: `**` inside code is code
	const parts = escape(text).split(/(`[^`]+`)/g);
	return parts
		.map((part) => {
			if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
				return `<code>${part.slice(1, -1)}</code>`;
			}
			return part
				.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
				.replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
				.replace(
					/\[([^\]]+)\]\(((?:https?:\/\/|\/|#)[^)\s]*)\)/g,
					(_, label: string, href: string) => `<a href="${href}">${label}</a>`
				);
		})
		.join('');
}
