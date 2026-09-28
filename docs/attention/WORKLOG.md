# Work log

## 2026-09-28 — ATT-001 — Foundation

**Intent.** Begin the approved direction in the existing repository and keep decisions, scope and evidence versioned.

**Repository evidence.** Remote HEAD is `master`, base commit `c17d9bf7802df466ce5c49464a3f801702a50acb`. The initial clone was clean. Existing code is a pnpm 8 workspace with TypeScript, Vitest, component schemas and web/XR renderers. No pre-existing AGENTS.md was found. Historical product guidance in `.cosmo-ui-claude-rules.md` conflicts with the approved human-control direction; ADR-002 records the resolution.

**Changes.** Private runtime and lab; untrusted request schema/parser; separate trusted host identity/evidence; explicit time, lifecycle, deduplication, grant revocation and response; two-policy comparison and event export; tracking and decision records. Existing v2 exports were not modified.

**Environment.** System Node is 18.16.1; system pnpm launcher failed. Used bundled Node 24.19.0 and the repository-pinned pnpm 8.15.0 through npm exec. The initial frozen-lockfile install succeeded. System `gh` cannot execute on this host (`bad CPU type`); no GitHub issue or PR is claimed here.

**Validation.**

- Pinned pnpm install with the updated frozen lockfile: passed.
- `pnpm --filter @cosmo/runtime build` and TypeScript no-emit check: passed.
- `pnpm exec vitest run`: 7 files, 131 tests passed (116 existing validator tests, 15 new runtime tests). Existing tests require the core-schema JS build first.
- `pnpm --filter @cosmo/attention-lab build`: JavaScript syntax checks passed.
- All five scenario streams replayed under both profiles; exported-format replay CLI verified both lanes on the expiry fixture (8 immediate-lane events and 6 Cosmo-lane events).
- Browser checks: initial 3-versus-1 grant comparison, dismissal without answer, explicit response, focus deferral and release, validity expiry at 10 seconds, and JSON export containing per-lane events and rendering receipts. No console errors observed. Export JSON remains available in a read-only panel when an embedded browser does not expose file downloads.
- Broader package build: blocked by pre-existing `packages/core-schema/src/plugin.ts` TS2584 at console calls, lines 660/663, under the ES-only tsconfig. The implicated files are unchanged from the base. JavaScript outputs were generated before declaration build failed; all existing validator tests then passed. Tracked as ATT-009; the full legacy CI is not claimed green.

Initial verification caught and corrected a relative schema-import path in the new tests. The first legacy test attempt also ran before core-schema was built; the final 131-test result above is after that prerequisite.

**Tracking.** GitHub umbrella [#1](https://github.com/antconsales/cosmo-ui/issues/1) created. The draft PR will reference it without closing the remaining work. A dedicated attention workflow isolates checks from the known legacy build issue. Remote CI status must be checked on the pushed commit, not inferred from local results.

**Limitations.** Simulated sources, manual context, no persistence/revisions/real host integration. See tracker for remaining scope. The masterplan is an archived proposal, not a status report.
