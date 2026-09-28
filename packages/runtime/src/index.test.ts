import { describe, expect, it } from "vitest";
import Ajv from "ajv";
import schema from "../../../spec/attention/0.1-experimental/request.schema.json";
import {
  canPresent,
  createState,
  parseRequest,
  reduce,
  type HostEvent,
  type AttentionRequest,
} from "./index";

const request = (
  id = "question",
  changes: Partial<AttentionRequest> = {}
): AttentionRequest => ({
  id,
  kind: "ask",
  title: "Choose the report scope",
  detail: "Include the previous quarter?",
  validForMs: 30000,
  options: ["Include", "Keep current"],
  ...changes,
});
const submit = (
  id = "question",
  at = 0,
  changes: Partial<AttentionRequest> = {}
): HostEvent => ({
  type: "submit",
  at,
  request: request(id, changes),
  principalId: "host-reviewer",
  blockedOnHuman: true,
});

describe("attention boundary and lifecycle", () => {
  it("matches the normative request schema for accepted and rejected examples", () => {
    const valid = new Ajv({ strict: false }).compile(schema);
    const samples: unknown[] = [
      request(),
      request("update", { kind: "inform", options: [] }),
      null,
      [],
      {},
      { ...request(), priority: 999 },
      { ...request(), principalId: "system" },
      request("bad id"),
      request("x", { validForMs: 0 }),
      request("x", { validForMs: 1.5 }),
      request("x", { options: [] }),
      request("x", { options: ["a", "a"] }),
      request("x", { kind: "inform" }),
      request("x", { title: "😀".repeat(120) }),
      request("x", { title: "😀".repeat(121) }),
      request("x", { detail: "" }),
    ];
    for (const sample of samples) {
      let accepted = true;
      try {
        parseRequest(sample);
      } catch {
        accepted = false;
      }
      expect(accepted, JSON.stringify(sample)).toBe(Boolean(valid(sample)));
    }
  });
  it("keeps informational events peripheral even if the host marks them blocking", () => {
    const state = reduce(
      createState(),
      submit("update", 0, { kind: "inform", options: [] })
    );
    expect(state.entries[0]?.status).toBe("peripheral");
    expect(state.entries[0]?.grant).toBeUndefined();
  });
  it("requires host evidence before a question can interrupt", () => {
    const state = reduce(createState(), {
      ...submit(),
      blockedOnHuman: false,
    } as HostEvent);
    expect(state.entries[0]?.reason).toBe("no-verified-human-block");
  });
  it("defers in focus mode and grants on an explicit context change", () => {
    let state = reduce(createState({ mode: "focused" }), submit());
    expect(state.entries[0]?.status).toBe("deferred");
    state = reduce(state, { type: "mode", at: 1000, mode: "available" });
    expect(state.entries[0]?.status).toBe("granted");
  });
  it("enforces one slot and cooldown, reconsidering the oldest request on tick", () => {
    let state = reduce(
      reduce(createState(), submit("first")),
      submit("second")
    );
    expect(state.entries[1]?.reason).toBe("slot-occupied");
    state = reduce(state, { type: "tick", at: 5000 });
    expect(state.entries[0]?.reason).toBe("grant-ended");
    expect(state.entries[1]?.reason).toBe("cooldown");
    state = reduce(state, { type: "tick", at: 10000 });
    expect(state.entries[1]?.status).toBe("granted");
    expect(state.entries[0]?.status).toBe("peripheral");
  });
  it("does not interpret presentation, dismissal or expiry as a response", () => {
    let state = reduce(createState(), submit());
    const grantId = state.entries[0]!.grant!.id;
    state = reduce(state, { type: "rendered", at: 0, grantId });
    expect(state.entries[0]?.rendered).toBe(true);
    expect(state.entries[0]?.status).toBe("granted");
    state = reduce(state, { type: "dismiss", at: 1, grantId });
    expect(state.entries[0]?.reason).toBe("dismissed-unresolved");
    state = reduce(state, { type: "tick", at: 30000 });
    expect(state.entries[0]?.status).toBe("expired");
    expect(state.entries[0]?.answer).toBeUndefined();
  });
  it("allows deliberate response from the inbox while interruptions are disabled", () => {
    let state = reduce(createState({ mode: "do-not-disturb" }), submit());
    state = reduce(state, {
      type: "respond",
      at: 1,
      requestId: "question",
      option: "Include",
    });
    expect(state.entries[0]?.answer).toBe("Include");
    expect(state.entries[0]?.status).toBe("resolved");
  });
  it("rejects fabricated answer options and ignores a response at the exact expiry", () => {
    const state = reduce(createState(), submit());
    expect(() =>
      reduce(state, {
        type: "respond",
        at: 1,
        requestId: "question",
        option: "Execute",
      })
    ).toThrow("invalid-response");
    const expired = reduce(state, {
      type: "respond",
      at: 30000,
      requestId: "question",
      option: "Include",
    });
    expect(expired.entries[0]?.answer).toBeUndefined();
    expect(expired.entries[0]?.status).toBe("expired");
  });
  it("revokes grants immediately on cancellation or mode change", () => {
    const state = reduce(createState(), submit());
    const id = state.entries[0]!.grant!.id;
    expect(canPresent(state, id, 4999)).toBe(true);
    expect(canPresent(state, id, 5000)).toBe(false);
    for (const event of [
      { type: "cancel", at: 1, requestId: "question" },
      { type: "mode", at: 1, mode: "focused" },
    ] as HostEvent[]) {
      const revoked = reduce(state, event);
      expect(canPresent(revoked, id, 1)).toBe(false);
      expect(revoked.entries[0]?.grant).toBeUndefined();
    }
  });
  it("ignores stale render receipts without presenting a request again", () => {
    let state = reduce(createState(), submit());
    const grantId = state.entries[0]!.grant!.id;
    state = reduce(state, { type: "rendered", at: 5000, grantId });
    expect(state.entries[0]?.rendered).toBe(false);
    expect(state.entries[0]?.grant).toBeUndefined();
    expect(state.trace.filter((t) => t.event === "granted")).toHaveLength(1);
  });
  it("deduplicates retries but rejects identity or content conflicts", () => {
    const first = reduce(createState(), submit());
    const retry = reduce(first, submit("question", 1000));
    expect(retry.entries).toHaveLength(1);
    expect(retry.entries[0]?.expiresAt).toBe(30000);
    expect(retry.trace.filter((t) => t.event === "granted")).toHaveLength(1);
    expect(() =>
      reduce(first, submit("question", 0, { title: "Changed" }))
    ).toThrow("request-id-conflict");
  });
  it("is immutable, rejects backwards time, and replays deterministically", () => {
    const events: HostEvent[] = [
      submit(),
      submit("second"),
      { type: "tick", at: 12000 },
    ];
    const initial = createState();
    const result = events.reduce(reduce, initial);
    expect(initial.entries).toEqual([]);
    expect(result).toEqual(events.reduce(reduce, createState()));
    const saved = JSON.stringify(result);
    const changed = reduce(result, { type: "tick", at: 15000 });
    changed.entries[0]!.request.options.push("mutation");
    expect(JSON.stringify(result)).toBe(saved);
    expect(() => reduce(result, { type: "tick", at: 1 })).toThrow(
      "invalid-clock"
    );
  });
  it("bounds retained requests and reports capacity rather than silently dropping", () => {
    let state = createState({ mode: "focused" });
    for (let n = 0; n < 100; n++) state = reduce(state, submit(`q${n}`));
    expect(() => reduce(state, submit("overflow"))).toThrow("request-capacity");
    expect(state.entries).toHaveLength(100);
  });
  it("holds core invariants over an adversarial deterministic event stream", () => {
    let state = createState();
    for (let n = 0; n < 80; n++) {
      const at = n * 1000;
      state = reduce(state, {
        type: "mode",
        at,
        mode: n % 3 === 0 ? "focused" : "available",
      });
      state = reduce(state, submit(`q${n}`, at, { validForMs: 4000 }));
      expect(state.entries.filter((e) => e.grant).length).toBeLessThanOrEqual(
        1
      );
      expect(state.entries.filter((e) => e.answer)).toEqual([]);
      for (const e of state.entries) {
        if (e.grant) expect(canPresent(state, e.grant.id, at)).toBe(true);
        if (e.expiresAt <= at) expect(e.status).toBe("expired");
      }
    }
  });
  it("makes the immediate baseline explicit while preserving user mode", () => {
    let state = createState({ profile: "immediate" });
    state = reduce(state, submit("update", 0, { kind: "inform", options: [] }));
    state = reduce(state, submit("question"));
    expect(state.entries.filter((e) => e.grant)).toHaveLength(2);
    state = reduce(state, { type: "mode", at: 1, mode: "do-not-disturb" });
    expect(state.entries.filter((e) => e.grant)).toHaveLength(0);
  });
});
