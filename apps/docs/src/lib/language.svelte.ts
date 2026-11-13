/**
 * Which language the reader is in, shared by every block on every page.
 *
 * One value rather than one per block: a reader who picks Rust on the first
 * sample of a page wants the second one, the shapes table and the next page in
 * Rust too. Remembered in `localStorage` and read through a `try`, because a
 * browser with site data blocked throws rather than answering — and a
 * documentation page must not be the thing that breaks.
 *
 * Empty until the browser says otherwise, so the server's markup and the first
 * render agree; every reader of it falls back to its first choice.
 */

const KEY = 'acyka:docs:language';

export const language = $state({ chosen: '' });

export function remember(id: string) {
	language.chosen = id;
	try {
		localStorage.setItem(KEY, id);
	} catch {
		// site data is blocked, which is a preference rather than a fault
	}
}

export function recall() {
	if (language.chosen) return;
	try {
		language.chosen = localStorage.getItem(KEY) ?? '';
	} catch {
		// as above
	}
}
