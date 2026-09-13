# Releasing

Six libraries, one tag, one version. `acyka@1.4.0` means the same contract in
every language, which is the whole reason they are generated together — a
version that means one thing in TypeScript and another in Rust would undo it.

```bash
# 1. the contract first, if the api has moved
bun run generate          # rewrites the six from openapi.json
bun test && bun --cwd packages/typescript run check

# 2. one tag, and the pipeline does the rest
git tag v1.4.0 && git push origin v1.4.0
```

`agreed` runs first and refuses the tag if `bun run generate` would change a
committed file: a release where the libraries disagree with `openapi.json` is a
release nobody can reason about. Then the six publish jobs run in parallel, and
`said` fails if any of them did not — **the fix for a partial publish is a patch
version, never a re-run**, because the versions that succeeded are already taken.

## What each one needs

Publishing is the one thing this repository cannot do on its own: every
registry wants its own credential, set as a CI/CD variable (masked, and
protected so only a protected tag can read it).

| job | variable | where it comes from |
|---|---|---|
| `npm` | `NPM_TOKEN` | npmjs.com → Access Tokens → Granular, write on `@acyka/*` |
| `pypi` | `PYPI_TOKEN` | pypi.org → API tokens, scoped to the `acyka` project |
| `crates` | `CARGO_REGISTRY_TOKEN` | crates.io → Account Settings → API Tokens, `publish-update` |
| `maven` | `MAVEN_GPG_KEY`, `MAVEN_GPG_PASSWORD` | an ASCII-armoured private key (`gpg --export-secret-keys -a`) and its passphrase; Maven Central refuses an unsigned artefact |
| `nuget` | `NUGET_API_KEY` | nuget.org → API Keys, push for `Acyka` |
| `headers` | — | the C++ tarball is attached to the release, so it needs nothing |

The first publish of each is also a name claim: `@acyka/api` on npm, `acyka` on
PyPI and crates.io, `cc.acyka:acyka` on Maven Central (which needs the
`cc.acyka` namespace verified against the domain first), `Acyka` on NuGet.
Until a name is claimed and its token exists, that job fails and `said` reports
it — which is the intended behaviour rather than a bug to route around.

## The contract moves on its own

A schedule reads `openapi.json` off the live server every morning, regenerates
the six, and opens a merge request if anything changed. It refuses a document
with fewer than thirty paths rather than overwrite the contract with an error
page. Nothing is published by it: a release is still a tag somebody pushes.
