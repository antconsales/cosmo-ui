/** Experimental single-host reducer. Host events and stored state are trusted inputs. */
export type Mode = "available" | "focused" | "do-not-disturb";
export type Profile = "cosmo" | "immediate";
export type Status =
  | "peripheral"
  | "deferred"
  | "granted"
  | "resolved"
  | "expired"
  | "cancelled";
export interface AttentionRequest {
  id: string;
  kind: "inform" | "ask";
  title: string;
  detail: string;
  validForMs: number;
  options: string[];
}
export interface Grant {
  id: string;
  expiresAt: number;
}
export interface Entry {
  request: AttentionRequest;
  principalId: string;
  blockedOnHuman: boolean;
  receivedAt: number;
  expiresAt: number;
  status: Status;
  reason: string;
  offered: boolean;
  rendered: boolean;
  answer?: string;
  grant?: Grant;
}
export interface Trace {
  sequence: number;
  at: number;
  requestId?: string;
  event: string;
  reason: string;
  profile: Profile;
  policyVersion: "reference-0.1";
}
export interface State {
  now: number;
  mode: Mode;
  profile: Profile;
  cooldownMs: number;
  grantMs: number;
  lastGrantAt: number | null;
  entries: Entry[];
  trace: Trace[];
}
export type HostEvent =
  | {
      type: "submit";
      at: number;
      request: unknown;
      principalId: string;
      blockedOnHuman: boolean;
    }
  | { type: "mode"; at: number; mode: Mode }
  | { type: "tick"; at: number }
  | { type: "cancel"; at: number; requestId: string }
  | { type: "respond"; at: number; requestId: string; option: string }
  | { type: "rendered" | "dismiss"; at: number; grantId: string };

const modes: Mode[] = ["available", "focused", "do-not-disturb"];
const terminal = (entry: Entry) =>
  ["resolved", "expired", "cancelled"].includes(entry.status);
const integer = (value: unknown, min: number, max: number): value is number =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  value >= min &&
  value <= max;
const string = (value: unknown, min: number, max: number): value is string =>
  typeof value === "string" &&
  [...value].length >= min &&
  [...value].length <= max;

/** Reject unknown fields, including agent-supplied priority, principal and host evidence. */
export function parseRequest(value: unknown): AttentionRequest {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid-request");
  const r = value as Record<string, unknown>;
  const keys = ["id", "kind", "title", "detail", "validForMs", "options"];
  if (
    Object.keys(r).length !== keys.length ||
    Object.keys(r).some((k) => !keys.includes(k)) ||
    !string(r.id, 1, 80) ||
    !/^[a-zA-Z0-9_-]+$/.test(r.id) ||
    !["inform", "ask"].includes(r.kind as string) ||
    !string(r.title, 1, 120) ||
    !string(r.detail, 1, 2000) ||
    !integer(r.validForMs, 1, 86400000) ||
    !Array.isArray(r.options) ||
    r.options.some((o) => !string(o, 1, 100)) ||
    new Set(r.options).size !== r.options.length ||
    (r.kind === "inform"
      ? r.options.length !== 0
      : r.options.length < 1 || r.options.length > 4)
  ) {
    throw new Error("invalid-request");
  }
  return {
    id: r.id,
    kind: r.kind as AttentionRequest["kind"],
    title: r.title,
    detail: r.detail,
    validForMs: r.validForMs,
    options: [...r.options] as string[],
  };
}

export function createState(
  options: {
    profile?: Profile;
    mode?: Mode;
    cooldownMs?: number;
    grantMs?: number;
  } = {}
): State {
  const profile = options.profile ?? "cosmo";
  const mode = options.mode ?? "available";
  const cooldownMs = options.cooldownMs ?? 10000;
  const grantMs = options.grantMs ?? 5000;
  if (
    !["cosmo", "immediate"].includes(profile) ||
    !modes.includes(mode) ||
    !integer(cooldownMs, 0, 86400000) ||
    !integer(grantMs, 1, 86400000)
  )
    throw new Error("invalid-policy");
  return {
    now: 0,
    mode,
    profile,
    cooldownMs,
    grantMs,
    lastGrantAt: null,
    entries: [],
    trace: [],
  };
}

function record(
  state: State,
  event: string,
  reason: string,
  requestId?: string
): void {
  state.trace.push({
    sequence: state.trace.length + 1,
    at: state.now,
    event,
    reason,
    profile: state.profile,
    policyVersion: "reference-0.1",
    ...(requestId ? { requestId } : {}),
  });
}
function transition(
  state: State,
  entry: Entry,
  status: Status,
  reason: string
): void {
  if (entry.status !== status || entry.reason !== reason) {
    entry.status = status;
    entry.reason = reason;
    record(state, status, reason, entry.request.id);
  }
}

/** The host must check this immediately before presentation and after any state update. */
export function canPresent(
  state: State,
  grantId: string,
  now: number
): boolean {
  return (
    Number.isSafeInteger(now) &&
    now >= state.now &&
    state.mode === "available" &&
    state.entries.some(
      (e) =>
        e.status === "granted" &&
        e.grant?.id === grantId &&
        now < e.grant.expiresAt &&
        now < e.expiresAt
    )
  );
}

function schedule(state: State): void {
  for (const entry of state.entries) {
    if (terminal(entry)) continue;
    if (state.now >= entry.expiresAt) {
      delete entry.grant;
      transition(state, entry, "expired", "validity-ended");
    } else if (
      entry.grant &&
      (state.mode !== "available" || state.now >= entry.grant.expiresAt)
    ) {
      delete entry.grant;
      transition(
        state,
        entry,
        "peripheral",
        state.mode !== "available" ? "grant-revoked" : "grant-ended"
      );
    }
  }
  let occupied = state.entries.some((e) => e.grant);
  // Array insertion order is the deterministic FIFO tie-breaker for this first profile.
  for (const entry of state.entries) {
    if (terminal(entry) || entry.grant || entry.offered) continue;
    if (
      state.profile === "cosmo" &&
      (entry.request.kind === "inform" || !entry.blockedOnHuman)
    ) {
      transition(state, entry, "peripheral", "no-verified-human-block");
    } else if (state.mode !== "available") {
      transition(state, entry, "deferred", "user-mode");
    } else if (state.profile === "cosmo" && occupied) {
      transition(state, entry, "deferred", "slot-occupied");
    } else if (
      state.profile === "cosmo" &&
      state.lastGrantAt !== null &&
      state.now - state.lastGrantAt < state.cooldownMs
    ) {
      transition(state, entry, "deferred", "cooldown");
    } else {
      entry.grant = {
        id: `grant-${state.trace.length + 1}-${entry.request.id}`,
        expiresAt: Math.min(entry.expiresAt, state.now + state.grantMs),
      };
      entry.offered = true;
      state.lastGrantAt = state.now;
      occupied = true;
      transition(
        state,
        entry,
        "granted",
        state.profile === "cosmo"
          ? "verified-human-block"
          : "immediate-baseline"
      );
    }
  }
}

/** Pure state transition. At most 100 retained requests / 1000 trace records per experiment. */
export function reduce(previous: State, event: HostEvent): State {
  if (!integer(event.at, previous.now, Number.MAX_SAFE_INTEGER - 86400000))
    throw new Error("invalid-clock");
  const state: State = {
    ...previous,
    now: event.at,
    entries: previous.entries.map((e) => ({
      ...e,
      request: { ...e.request, options: [...e.request.options] },
      ...(e.grant ? { grant: { ...e.grant } } : {}),
    })),
    trace: previous.trace.map((t) => ({ ...t })),
  };
  // Expire/revoke before a response or receipt at this timestamp can be accepted.
  for (const entry of state.entries) {
    if (!terminal(entry) && state.now >= entry.expiresAt) {
      delete entry.grant;
      transition(state, entry, "expired", "validity-ended");
    }
  }
  switch (event.type) {
    case "submit": {
      const request = parseRequest(event.request);
      if (
        !string(event.principalId, 1, 100) ||
        typeof event.blockedOnHuman !== "boolean"
      )
        throw new Error("invalid-host-evidence");
      const prior = state.entries.find((e) => e.request.id === request.id);
      if (prior) {
        if (
          JSON.stringify(prior.request) !== JSON.stringify(request) ||
          prior.principalId !== event.principalId ||
          prior.blockedOnHuman !== event.blockedOnHuman
        )
          throw new Error("request-id-conflict");
        record(state, "duplicate", "already-recorded", request.id);
      } else {
        if (state.entries.length >= 100) throw new Error("request-capacity");
        state.entries.push({
          request,
          principalId: event.principalId,
          blockedOnHuman: event.blockedOnHuman,
          receivedAt: event.at,
          expiresAt: event.at + request.validForMs,
          status: "peripheral",
          reason: "submitted",
          offered: false,
          rendered: false,
        });
        record(state, "submitted", "host-bound-identity", request.id);
      }
      break;
    }
    case "mode":
      if (!modes.includes(event.mode)) throw new Error("invalid-mode");
      state.mode = event.mode;
      record(state, "mode", event.mode);
      break;
    case "cancel":
    case "respond": {
      const entry = state.entries.find((e) => e.request.id === event.requestId);
      if (!entry || terminal(entry)) {
        record(state, "ignored", "request-not-active", event.requestId);
      } else if (event.type === "cancel") {
        delete entry.grant;
        transition(state, entry, "cancelled", "host-cancelled");
      } else {
        if (
          entry.request.kind !== "ask" ||
          !entry.request.options.includes(event.option)
        )
          throw new Error("invalid-response");
        entry.answer = event.option;
        delete entry.grant;
        transition(state, entry, "resolved", "explicit-host-response");
      }
      break;
    }
    case "rendered":
    case "dismiss": {
      const entry = state.entries.find((e) => e.grant?.id === event.grantId);
      if (!entry || !canPresent(state, event.grantId, event.at)) {
        record(state, "ignored", "grant-not-active");
      } else if (event.type === "rendered") {
        if (!entry.rendered) {
          entry.rendered = true;
          record(state, "rendered", "adapter-receipt", entry.request.id);
        }
      } else {
        delete entry.grant;
        transition(state, entry, "peripheral", "dismissed-unresolved");
      }
      break;
    }
    case "tick":
      break;
    default:
      throw new Error("unknown-event");
  }
  schedule(state);
  if (state.trace.length > 1000) throw new Error("trace-capacity");
  return state;
}
