/**
 * The shape of the rail, and the half of it that is written by hand.
 *
 * The guides are a written list because their order is an argument — "start
 * here", then authorising, then the things that bite. The reference half is
 * read off the contract instead, and that is in `$lib/server/nav.ts`, because
 * reading the contract means holding all 160 KB of it and no browser needs
 * that to draw a list of links.
 */

export type Link = { href: string; label: string; hint?: string; verb?: string };
export type Group = { label: string; links: Link[] };

/** A guide: where it is, what it is called, the line under its title, and its sections. */
export type Guide = {
	href: string;
	label: string;
	lede: string;
	sections: { id: string; label: string }[];
};

/**
 * The guides, in the order somebody reads them.
 *
 * The ledes and the sections are written here as well as on the pages, because
 * the search box has to find a section of a guide nobody has opened yet — and a
 * page's headings only exist once the page is rendered. A seam test
 * (`nav.test.ts`) reads every guide's source and fails when the two disagree.
 */
export const GUIDES: Guide[] = [
	{
		href: '/docs',
		label: 'Start here',
		lede: 'What this api is, what it is not, and a call that works in about two minutes.',
		sections: [
			{ id: 'the-shape-of-it', label: 'The shape of it' },
			{ id: 'not-here', label: 'What is deliberately not here' },
			{ id: 'register', label: 'Register an application' },
			{ id: 'install', label: 'Install a library' },
			{ id: 'first-call', label: 'The first call' },
			{ id: 'then', label: 'Then' }
		]
	},
	{
		href: '/docs/authorising',
		label: 'Authorising',
		lede: 'Four ways to hold a token, and which one your application wants.',
		sections: [
			{ id: 'app-only', label: 'An application acting for itself' },
			{ id: 'a-person', label: 'Acting for a person' },
			{ id: 'no-browser', label: 'Something with no browser' },
			{ id: 'a-token-you-have', label: 'A token you already have' }
		]
	},
	{
		href: '/docs/scopes',
		label: 'Scopes',
		lede: 'What each word opens, and why the list is short.',
		sections: []
	},
	{
		href: '/docs/paging',
		label: 'Paging',
		lede: 'Offset and limit, a total you should not count against, and the loop each library writes for you.',
		sections: [
			{ id: 'stop-on-a-short-page', label: 'Stop on a short page, not on total' },
			{ id: 'ordering', label: 'The order is stable' },
			{ id: 'which', label: 'Which operations page' }
		]
	},
	{
		href: '/docs/errors',
		label: 'Errors',
		lede: 'A phrase name and never a sentence — and why that is what makes a real error type possible.',
		sections: [
			{ id: 'the-distinction', label: '401 and 403 are not the same problem' },
			{ id: 'the-names', label: 'The names' },
			{ id: 'not-json', label: 'An answer that is not JSON' }
		]
	},
	{
		href: '/docs/rate-limits',
		label: 'Rate limits',
		lede: 'Sixty a minute, six hundred once somebody has vouched for you, and three headers so you never have to guess.',
		sections: [
			{ id: 'what-you-get', label: 'What you get' },
			{ id: 'the-headers', label: 'Three headers, on every answer' },
			{ id: 'the-refusal', label: 'And on the refusal' },
			{ id: 'what-the-libraries-do', label: 'What the libraries do about it' },
			{ id: 'the-other-ceiling', label: 'There is a second ceiling, and it is not about you' },
			{ id: 'asking-for-more', label: 'Asking for more' }
		]
	},
	{
		href: '/docs/webhooks',
		label: 'Webhooks',
		lede: 'Being told, instead of asking — and the three lines of verification everybody gets wrong.',
		sections: [
			{ id: 'who-hears-what', label: 'Who hears what' },
			{ id: 'what-arrives', label: 'What arrives' },
			{ id: 'verify', label: 'Verifying it' },
			{ id: 'retries', label: 'Retries, and when we stop' },
			{ id: 'the-address', label: 'The address has to be public https' }
		]
	},
	{
		href: '/docs/libraries',
		label: 'The libraries',
		lede: 'Six of them, and they are the same library six times rather than six libraries.',
		sections: [
			{ id: 'generated', label: 'What is generated' },
			{ id: 'by-hand', label: 'What is written by hand, in each of them' },
			{ id: 'per-language', label: 'And the parts that are about the language' },
			{ id: 'snake-case', label: 'The wire stays snake_case' },
			{ id: 'something-missing', label: 'If something is missing' }
		]
	}
];

/** One thing the search box can take you to. */
export type Found = {
	href: string;
	label: string;
	/** what kind of thing it is, which is also how the list is grouped */
	kind: 'guide' | 'section' | 'operation' | 'shape';
	/** the line under it: a guide's lede, an operation's address */
	hint?: string;
	verb?: string;
	/** extra words it should be found by, which are not shown */
	words?: string;
};
