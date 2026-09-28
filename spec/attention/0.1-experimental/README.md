# Attention experiment 0.1 — local contract

This is not the full normative wire protocol proposed in the research masterplan.
`request.schema.json` specifies the untrusted agent request. Runtime types specify trusted in-process host events. The private package rejects unknown agent fields.

## Request identity and validity

IDs are unique in one host run. Identical retries are recorded without extending validity or granting again. Reuse with different content or host identity is an error; revisions are not implemented. Durations are integer milliseconds, normalized to host receipt time. Validity ends at `now >= expiresAt`.

## Host boundary

The host authenticates the producer and supplies `principalId` and `blockedOnHuman` outside the request. The demo fabricates these for simulation and does not claim authentication. All events, timestamps and persisted state must originate from a trusted host. No network endpoint accepts these events.

## State semantics

`peripheral`: visible on explicit consultation, no active grant. `deferred`: eligible in principle but waiting on mode, slot or cooldown. `granted`: a temporary presentation grant exists. `resolved`: the host provided a valid explicit response. `cancelled`: the host cancelled. `expired`: request validity ended without resolution.

Rendering is a separate receipt, not a terminal status. Dismissal removes a grant and returns an unanswered request to the inbox. Each request receives at most one grant in this reference profile. Grant expiry does not imply request expiry. Terminal records remain for the duration of the run.

The adapter checks `canPresent` immediately before rendering and reconciles grants after each event. The host must dispatch ticks as time advances. `canPresent` also checks expiry without requiring an earlier tick. Changing mode revokes active grants. Content already perceived cannot be retracted.

Explicit responses may originate from the inbox without an active grant. Unknown options are rejected. Responses to cancelled/expired/resolved requests are ignored with a reason. No `approval` kind exists in this slice; nothing authorizes an external action.

## Reference policy

`cosmo`: only verified blocking questions may interrupt; FIFO among eligible requests, one active slot, configurable cooldown. Information remains peripheral. `immediate`: all requests may obtain simultaneous grants. Both respect user mode and validity. These profiles are versioned `reference-0.1` and their comparison is not a claim of optimality.

## Errors and bounds

Invalid request/policy/clock/evidence, conflicting IDs, invalid response, request capacity and trace capacity throw before committing state. The reducer is pure, so the caller retains the previous state on failure. Up to 100 requests and 1000 trace records are retained. Unknown/expired response targets and stale render receipts instead produce `ignored` trace records. The host is responsible for presenting errors and retry decisions.

Trace records include time, profile, policy version, event, reason and request ID; titles, details and answers are excluded. Request IDs may still be sensitive. Lab exports include full simulated requests; production export/privacy design is not implemented.
