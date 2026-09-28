# Attention runtime tracker

Updated: 2026-09-28. IDs are stable across local commits and future GitHub issues.

GitHub umbrella: [issue #1](https://github.com/antconsales/cosmo-ui/issues/1). Keep it open until the subsequent increments are resolved.

| ID | Work item | State | Acceptance |
| --- | --- | --- | --- |
| ATT-001 | Traceable first vertical experiment | Implemented; draft review | Private runtime, request schema, two-policy lab, lifecycle tests, replay and work log. |
| ATT-002 | Real host integration | Planned | An actual host event binds identity/evidence; an explicit answer returns to that session. Record the integration boundary and unavailable capabilities. |
| ATT-003 | Revisions and stale answers | Planned | A new revision revokes old grants; an answer to an old version cannot resolve the new one; conformance fixtures cover the race. |
| ATT-004 | Context freshness and presentation failure | Planned | Unknown/stale context has explicit fallback; failed renderer receipts never imply delivery; requests remain discoverable. |
| ATT-005 | Versioned protocol and conformance | Planned | Host-envelope schema, semantic transitions, error codes, independent fixture runner; separate invariant conformance from reference-policy outputs. |
| ATT-006 | Durable host and bounded storage | Planned | Recovery, retention and queue backpressure tested; no silent request loss or invented outcomes after restart. |
| ATT-007 | Stronger baselines and scheduler evaluation | Planned | Priority/cooldown and bounded-deferral baselines, per-source quotas, fair-service scenarios and p50/p95/p99 on a declared machine. |
| ATT-008 | External integrators and pilot | Planned | Recruit candidates, document actual workflows, predefine outcomes, report negative cases and limits. No participants have been recruited. |
| ATT-009 | Existing core-schema declaration build | Confirmed baseline failure | Resolve ES-only compilation of console calls in plugin.ts; verify full monorepo build separately. |

## ATT-001 checklist

- [x] Clone the existing repository and preserve its base commit.
- [x] Establish active engineering guidance and supersede conflicting historical product assumptions.
- [x] Archive the researched proposal with its original consultation date.
- [x] Implement request parsing, host binding, deterministic lifecycle and explainable transitions.
- [x] Add five simulated scenarios and a manual-clock web comparison.
- [x] Export event streams for deterministic replay.
- [x] Run runtime checks, relevant existing tests and browser interactions.
- [x] Record actual results and prepare the isolated increment for draft review.

## Scope guard

Do not close ATT-002 because the lab simulates an agent. Do not close ATT-005 because a request JSON Schema exists. Do not close ATT-008 based on internal use, demo counters or positive feedback alone.
