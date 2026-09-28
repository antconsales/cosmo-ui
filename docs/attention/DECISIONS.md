# Decision log

## ADR-001 — Additive experiment in the existing repository

Date: 2026-09-28. Status: accepted for the first increment.

The user approved beginning the researched direction and requested using the existing repository with traceability. Base: `c17d9bf7802df466ce5c49464a3f801702a50acb` on `master`. Work branch: `codex/attention-runtime-foundation`.

Keep the existing packages and history. Add a private `@cosmo/runtime` package and `examples/attention-lab`; do not rename the project, migrate existing users or publish a release. Use the existing workspace patterns rather than creating another repository.

## ADR-002 — Human authority supersedes the historical AI-first product rule

Date: 2026-09-28. Status: accepted.

The historical Claude rules call humans secondary observers. That conflicts with the user-approved masterplan. Root `AGENTS.md` establishes the active direction while keeping useful constraints: explicit schemas, validation, non-invasive presentation and small increments.

## ADR-003 — Pure reducer and explicit host boundary

Date: 2026-09-28. Status: experimental.

Use an immutable TypeScript reducer with explicit nondecreasing timestamps, no runtime dependencies, network, UI or LLM. Agent requests cannot carry authoritative host evidence. Identity and blocked-on-human status are separate trusted host fields. The host must genuinely verify them in a real integration.

Presentation, rendering and response are different events. A grant is a local presentation handle, not a cryptographic permission or execution authorization. Only a host-supplied explicit choice resolves an `ask`.

## ADR-004 — Small vertical slice before the full protocol

Date: 2026-09-28. Status: accepted for ATT-001.

The full masterplan includes revisions, persistent state, capability negotiation, quotas and more baselines. Implement only a single-host lifecycle, manual modes, one slot, cooldown, deduplication, expiry, cancellation and response first. Schema covers agent requests only; host events are typed internal API. Full wire protocol/conformance is deferred to ATT-005.

Use native browser modules and a loopback-only static server for the lab. No new rendering framework or runtime dependency. `tsc` builds the isolated ESM package; there is no need for a bundler until a consumer requires one.

## ADR-005 — Evidence and scope of comparisons

Date: 2026-09-28. Status: accepted.

Start with immediate presentation versus the Cosmo reference policy, using the same request stream. Label grants as grants; rendering does not prove perception. Export all lane events so replay includes responses and receipts. Record stronger baselines and human studies as outstanding work, not results.

One grant per request prevents repeated nagging in this slice. Once a grant ends, the request remains in the inbox until response, cancellation or expiry. This is a deliberate limited policy, not a universal fairness guarantee.
