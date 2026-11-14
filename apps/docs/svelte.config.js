import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),
	kit: {
		// Every page is written out at build time and served as a file: the
		// contract only changes on a deploy, so a process rendering the same
		// forty-three pages for every reader was a server doing nothing. Caddy
		// serves `build/` as it is; `404.html` is the page for an address
		// nothing was written for.
		// `precompress` writes `.br` and `.gz` beside each file for Caddy to hand over
		adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html', precompress: true, strict: true }),
		prerender: {
			// a missing anchor is a broken link in the docs, and the build should say so
			handleMissingId: 'fail',
			handleHttpError: 'fail'
		},
		alias: {
			// The generator's reader, imported rather than copied. One description
			// of what `allOf` means and what `Items_TitleCard` is, shared by the
			// six libraries and by the pages that document them — a second copy
			// here would be a reference that disagreed with the clients.
			'$tools': '../../tools',
			'$contract': '../../openapi.json'
		}
	}
};
