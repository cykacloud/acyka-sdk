/**
 * The site is written out at build time, every page of it.
 *
 * Documentation that needs JavaScript to say anything is documentation a search
 * engine cannot read and a reader on a slow connection sees as a blank page —
 * so each page is rendered once, into HTML, when the site is built, and the
 * browser takes over from there. The playground is the same HTML shell and asks
 * the browser for everything else.
 */
export const prerender = true;
export const ssr = true;
