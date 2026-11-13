/**
 * The rail and the search index, worked out once per request rather than once
 * per reader.
 *
 * Both are derived from `openapi.json`, and deriving them in the layout put the
 * whole 160 KB document and the flattener that reads it into the client bundle
 * — every page, every visit, to draw a list of links. Handed over as data they
 * are a few kilobytes in the payload the page already ships.
 */

import { index, sidebar } from '$lib/server/nav';

export const load = () => ({ rail: sidebar(), found: index() });
