# The public API on v2, the SDKs reworked, and dev.acyka.cc rebuilt

A plan, not work in progress. It is here so the next person to pick it up starts
from a decision rather than from a blank page. Written 2026-11-10, while api v2
(the federated graph, `acyka/api`) was replacing v1 route by route.

## Where it stands

- **The public API is v1's.** It has 37 paths under `/api/v1/*` on
  `api.acyka.cc` (titles, users, characters, people, collections, lists,
  following, calendar, genres, me and posts). `openapi.json` is read off the v1
  server, and the six libraries in `packages/` are generated from it.
- **v1 is going away.** Every first-party client is moving to the graph, and
  the graph is closed: only persisted, safelisted operations answer. Third
  parties cannot write their own queries against it, which is deliberate.
- **dev.acyka.cc** is `apps/docs`, already on `@cyka/ui`. It has guides, a
  reference read off `openapi.json`, and a playground.

## The decision: REST for everybody else, as a facade over the graph

Third parties get **REST, not GraphQL**:

- A public GraphQL endpoint is a cost model nobody outside can reason about (one
  query can be ten thousand rows), a cache that does not work at the edge, and a
  second contract to version beside the one the clients already need.
- REST with OpenAPI is what the six languages' tooling already reads.

The facade lives at **`external.moe/api/v1/*`**, in the same paths and shapes as
today's v1 public API, so the existing SDKs keep working on the day of the move.
It is a thin Rust service (`services/rest`, its own port, behind the router's
edge) that answers each path by running **a persisted graph operation of its
own**, `router/documents/rest.json`, the same seam the apps use. So:

- every public path is a named, reviewed operation, and the safelist test
  fails when the facade names something the graph does not have;
- the facade has no SQL and no business rules of its own: the graph's answer,
  reshaped to the documented JSON;
- rate limits, OAuth scopes and app verification stay where they are today, in
  `crates/oauth` and the shield, applied before the operation runs.

`openapi.json` then comes off the facade, which writes it from `utoipa`
annotations exactly as v1 does today, with the same "every documented path
answers" test against the real router.

## Phases

1. **Parity.** All 37 paths, the same shapes, served by the facade.
   - A contract test replays v1's recorded answers for a fixed set of ids against
     the facade and diffs the JSON.
   - `api.acyka.cc/api/v1/*` is pointed at the facade only when the diff is
     empty.
2. **What v1 never had.** Each new path is first a graph operation the apps
   already use, so nothing new is built only for third parties:
   - **writes:** folders, progress, posts, follows, reactions, with OAuth scopes
     `folders:write`, `social:write` and so on;
   - **webhooks:** the event kinds in `/oauth/webhook-events`, delivered from
     NATS rather than v1's in-process hub;
   - **cursor pagination everywhere:** `?after=`, with offset kept on the old
     paths only.
3. **v2 of the public API**, once phase 2 shows what the shapes should have been:
   - `/api/v2/*`, with v1's paths frozen and kept;
   - one error format (`application/problem+json` with the phrase key, the same
     keys the apps translate);
   - ETags and `Cache-Control` on every read.

## The SDKs, reworked

The generator stays: one reader, six emitters, with types and one method per
operation generated from the contract. What changes is what is written by hand
in each language, which today is only a transport:

- **auth:**
  - OAuth with PKCE for apps that act for a person;
  - client credentials for apps that act as themselves;
  - token refresh handled, never surfaced as a 401 to the caller.
- **pagination:** a page-iterator per language (`for await` in TypeScript, a
  generator in Python, `Stream` in Rust, `Flow` in Kotlin, `IAsyncEnumerable` in
  C#, an iterator in C++) over the cursor, so nobody writes the loop.
- **errors:**
  - one typed error per language, carrying the HTTP status, the phrase key and,
    for 429, `retryAfter`;
  - the client retries a 429 itself, with jitter, up to a budget.
- **webhooks:** signature verification (the `X-Acyka-Signature` HMAC) as one
  function in each language, plus the event types generated from the contract.
- **releases:** one version for all six, cut from one tag. The tag must equal
  `openapi.json`'s `info.version`, as the other repositories already pin theirs.
  `RELEASING.md` gets rewritten for it.
- **tests:**
  - each library runs the same scenario file against a recorded facade
    (fixtures from phase 1's contract test);
  - a library that drifts fails its own pipeline rather than a user's build.

## dev.acyka.cc, rebuilt on cyka ui

The same app (`apps/docs`), rebuilt around three kinds of page, all from the kit:

- **Guides:** written by hand, in the site's typography (`@cyka/ui` prose, the
  same fonts and colours as acyka.cc):
  1. getting a key;
  2. the first request in each language;
  3. OAuth for apps that act for a person;
  4. webhooks;
  5. pagination;
  6. errors and rate limits;
  7. moving from v1.
- **Reference:** one page per operation, generated from `openapi.json`. Each
  page has:
  - parameters and the response as the kit's tables;
  - a code sample in all six languages, from the SDKs' own doc-tests so it
    cannot be stale;
  - a "try it" panel.
- **Playground:**
  - sign in with an acyka account (the same OAuth the panels use) and send real
    requests as yourself;
  - the request and the answer side by side, with copy-as-curl and
    copy-as-code in the six languages.
- **Look:**
  - the kit's layout (sidebar navigation, ⌘K search over guides and operations,
    light and dark);
  - the site's hero treatment on the landing page;
  - one page per SDK with its install line and a status badge (version, CI).

## Order, once the graph is complete

1. The facade, at parity (phase 1), with the contract test.
2. `api.acyka.cc/api/v1/*` switched to it, and v1's own public routes deleted.
3. The SDK rework (auth, pagination, errors, webhooks, one release), against the
   facade.
4. dev.acyka.cc rebuilt, with the reference generated and the samples from the
   SDKs' doc-tests.
5. Phase 2 paths (writes, webhooks) as the apps' graph operations settle.
