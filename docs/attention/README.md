# COSMO attention-runtime experiment

Status: experimental, private packages. Started 2026-09-28 in the existing `antconsales/cosmo-ui` repository.
The v2 component APIs remain intact. This is an additive, single-host experiment, not a stable protocol.

Agents request attention; the host binds identity and evidence; the user controls interruptions.
The runtime records what happens when presentation is allowed, deferred, dismissed or unanswered.

## Start here

- [Activity tracker](TRACKER.md): stable work-item IDs, scope and acceptance criteria.
- [Decision log](DECISIONS.md): rationale and changes to the plan.
- [Work log](WORKLOG.md): actual work and validation evidence.
- [Experimental contract](../../spec/attention/0.1-experimental/README.md).
- [Research masterplan](research/2026-09-27-masterplan.md): proposal and sources, not implemented features.

## Run the first experiment

From the repository root, with its pinned pnpm 8 toolchain:

```sh
pnpm install --frozen-lockfile
pnpm --filter @cosmo/runtime build
pnpm --filter @cosmo/runtime typecheck
pnpm exec vitest run packages/runtime/src/index.test.ts
pnpm --filter @cosmo/attention-lab dev
```

Open `http://127.0.0.1:4318`. Both lanes receive the same simulated requests. Each lane has its own explicit responses and technical rendering receipts. The manual clock makes expiry, revocation and cooldown reproducible.

The baseline emits grants for every eligible event. Cosmo keeps informational events peripheral and emits at most one active grant for a verified blocking question, with a 10-second cooldown. Both obey user mode, validation, expiry and cancellation. This is only the first baseline; superiority over a stronger priority/cooldown policy is not established.

The counter measures **grants**, not human attention, perceived interruptions or productivity. DOM insertion generates a technical receipt, never consent. Responses only change local demo state; there is no external agent or action executor.

## Replay

Export a run from the lab, then use:

```sh
node examples/attention-lab/replay.mjs /path/to/cosmo-replay.json
```

The command rebuilds both states from recorded events and compares them with the exported states. The export contains simulated request content and choices but excludes the personal note. It is not a production telemetry format.

## Deliberate limits

- A single trusted, in-memory host; no persistence or distributed security guarantees.
- Only `inform` and `ask`; no execution approvals, revisions or automatic model decisions.
- One grant maximum per request. Failed or dismissed presentations remain in the inbox, without automatic re-interruption.
- At most 100 retained requests and 1000 trace records per run. Capacity produces an explicit error; restart the experiment to clear state.
- Manual context never expires in this first slice. Context freshness, renderer failures, quotas and fairness are tracked follow-ups.
- The runtime receives normalized host events. The request parser validates the untrusted request; this is not a general untrusted-event endpoint.

## Tracking practice

Every meaningful change updates the tracker, decision log when applicable, and work log. Commits reference `ATT-*` IDs. Keep proposed research separate from implemented and validated behavior. GitHub issues/PRs can mirror these IDs; checked-in records remain usable offline.
