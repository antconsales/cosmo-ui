# COSMO engineering guidance

The active direction is the user-approved attention-runtime experiment. See
`docs/attention/README.md`, `docs/attention/DECISIONS.md` and `docs/attention/TRACKER.md`.
It supersedes conflicting product assumptions in `.cosmo-ui-claude-rules.md`,
particularly the claim that humans are secondary observers. Existing v2 APIs remain supported.

- Keep the experimental runtime independent of React, DOM, network, vendor SDKs and LLMs.
- Agent input is untrusted. Host identity and evidence are supplied separately.
- A presentation grant is not authorization to execute an action. Silence is not consent.
- Use explicit time, deterministic ordering and structured reason codes.
- Keep a request discoverable when an interruption is deferred or dismissed.
- Change schemas, semantics, tests and documentation together.
- Keep existing packages and examples working; record unrelated baseline failures separately.
- Update the activity tracker and append significant decisions with their rationale.
- Every completed increment records commands, results and remaining limitations in the work log.
- Do not claim production readiness, measured human benefit or standards adoption without evidence.
- Use small commits on `codex/` branches. No forced pushes or automatic releases.
