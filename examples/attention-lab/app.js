import { createState, reduce, canPresent } from "/runtime.js";
import { scenarios } from "/scenarios.js";

const $ = (id) => document.getElementById(id);
const profiles = ["immediate", "cosmo"];
let now = 0;
let lanes;
const status = {
  peripheral: "In consultazione",
  deferred: "Rinviata",
  granted: "Presentazione attiva",
  resolved: "Risposta ricevuta",
  expired: "Scaduta",
  cancelled: "Annullata",
};
const reasons = {
  submitted: "Ricevuta",
  "no-verified-human-block": "Non richiede un intervento verificato",
  "user-mode": "La tua modalità limita le interruzioni",
  "slot-occupied": "Una richiesta occupa già lo spazio",
  cooldown: "Pausa tra le interruzioni",
  "verified-human-block": "Il lavoro attende una scelta",
  "immediate-baseline": "La baseline presenta ogni nuovo evento",
  "grant-ended": "Presentazione terminata; richiesta ancora consultabile",
  "grant-revoked": "Presentazione revocata dalla modalità",
  "dismissed-unresolved": "Chiusa, ma ancora senza risposta",
  "validity-ended": "Validità terminata, nessuna risposta automatica",
  "explicit-host-response": "Scelta esplicita ricevuta",
  "host-cancelled": "Annullata dall’host",
};
function el(tag, text, className) {
  const n = document.createElement(tag);
  if (text) n.textContent = text;
  if (className) n.className = className;
  return n;
}
function dispatch(profile, event) {
  const lane = lanes[profile];
  lane.state = reduce(lane.state, event);
  lane.events.push(event);
}
function emit(event, profile) {
  try {
    for (const p of profile ? [profile] : profiles) dispatch(p, event);
    $("error").textContent = "";
    render();
  } catch (error) {
    $("error").textContent = error.message;
  }
}
function reset() {
  now = 0;
  lanes = Object.fromEntries(
    profiles.map((profile) => [
      profile,
      { state: createState({ profile }), events: [] },
    ])
  );
  $("export-panel").hidden = true;
  for (const event of scenarios[$("scenario").value].events)
    for (const p of profiles) dispatch(p, event);
  $("mode").value = lanes.cosmo.state.mode;
  render();
}
function button(label, action, secondary = false) {
  const b = el("button", label, secondary ? "secondary" : "");
  b.addEventListener("click", action);
  return b;
}
function render() {
  const focused = document.activeElement;
  const focusKey = focused?.dataset?.focusKey;
  const opened = new Set(
    [...document.querySelectorAll("details[open]")].map((d) => d.id)
  );
  $("clock").textContent = `${String(Math.floor(now / 60000)).padStart(
    2,
    "0"
  )}:${String(Math.floor(now / 1000) % 60).padStart(2, "0")}`;
  const panels = [];
  const receipts = [];
  for (const profile of profiles) {
    const s = lanes[profile].state;
    const panel = el("section", null, `lane ${profile}`);
    panel.append(
      el(
        "p",
        profile === "cosmo" ? "POLICY SPERIMENTALE" : "CONFRONTO",
        "eyebrow"
      ),
      el("h2", profile === "cosmo" ? "Cosmo" : "Notifica immediata"),
      el(
        "p",
        profile === "cosmo"
          ? "Aggiornamenti periferici, una richiesta bloccante alla volta."
          : "Ogni evento può interrompere. Le modalità utente restano rispettate."
      )
    );
    const stats = el("div", null, "stats");
    for (const [label, count] of [
      ["Grant emessi", s.trace.filter((t) => t.event === "granted").length],
      [
        "Senza risposta",
        s.entries.filter(
          (e) =>
            e.request.kind === "ask" &&
            !["resolved", "expired", "cancelled"].includes(e.status)
        ).length,
      ],
      ["Scadute", s.entries.filter((e) => e.status === "expired").length],
    ]) {
      const stat = el("div", null, "stat");
      stat.append(el("strong", String(count)), el("span", label));
      stats.append(stat);
    }
    panel.append(stats);
    const active = s.entries.filter(
      (e) => e.grant && canPresent(s, e.grant.id, now)
    );
    panel.append(el("div", "PRESENTAZIONI ATTIVE", "section-label"));
    if (!active.length)
      panel.append(
        el(
          "div",
          "Nessuna interruzione attiva. Le richieste restano qui sotto.",
          "empty"
        )
      );
    function card(entry, isActive) {
      const c = el("article", null, `entry ${isActive ? "active" : ""}`);
      c.append(
        el("div", `${entry.principalId} · ${status[entry.status]}`, "meta"),
        el("h3", entry.request.title),
        el("p", entry.request.detail),
        el("p", reasons[entry.reason] ?? entry.reason, "status")
      );
      if (entry.answer) c.append(el("p", `Risposta: ${entry.answer}`));
      const actions = el("div", null, "actions");
      const live = !["resolved", "expired", "cancelled"].includes(entry.status);
      if (entry.request.kind === "ask" && live)
        for (const option of entry.request.options) {
          const b = button(option, () =>
            emit(
              { type: "respond", at: now, requestId: entry.request.id, option },
              profile
            )
          );
          b.dataset.focusKey = `${profile}:${entry.request.id}:${option}`;
          actions.append(b);
        }
      if (isActive) {
        actions.append(
          button(
            "Chiudi senza rispondere",
            () =>
              emit(
                { type: "dismiss", at: now, grantId: entry.grant.id },
                profile
              ),
            true
          )
        );
      }
      if (live)
        actions.append(
          button(
            "Annulla richiesta",
            () =>
              emit(
                { type: "cancel", at: now, requestId: entry.request.id },
                profile
              ),
            true
          )
        );
      c.append(actions);
      return c;
    }
    for (const entry of active) {
      panel.append(card(entry, true));
      if (!entry.rendered)
        receipts.push([
          profile,
          { type: "rendered", at: now, grantId: entry.grant.id },
        ]);
    }
    panel.append(el("div", "INBOX E AGGIORNAMENTI", "section-label"));
    for (const entry of s.entries.filter((e) => !active.includes(e)))
      panel.append(card(entry, false));
    const detail = el("details");
    detail.id = `trace-${profile}`;
    detail.open = opened.has(detail.id);
    detail.append(
      el("summary", "Perché? Apri la trace"),
      el(
        "pre",
        s.trace
          .map(
            (t) =>
              `${t.sequence}. ${t.at}ms · ${t.requestId ?? "host"} · ${
                t.event
              } · ${t.reason}`
          )
          .join("\n")
      )
    );
    panel.append(detail);
    panels.push(panel);
  }
  $("comparison").replaceChildren(...panels);
  if (focusKey)
    [...document.querySelectorAll("[data-focus-key]")]
      .find((n) => n.dataset.focusKey === focusKey)
      ?.focus();
  // A technical DOM-insertion receipt is not evidence of human attention.
  for (const [p, event] of receipts) dispatch(p, event);
  for (const p of profiles)
    $(`trace-${p}`).querySelector("pre").textContent = lanes[p].state.trace
      .map(
        (t) =>
          `${t.sequence}. ${t.at}ms · ${t.requestId ?? "host"} · ${t.event} · ${
            t.reason
          }`
      )
      .join("\n");
}
for (const [value, scenario] of Object.entries(scenarios)) {
  const o = el("option", scenario.label);
  o.value = value;
  $("scenario").append(o);
}
$("scenario").addEventListener("change", reset);
$("reset").addEventListener("click", reset);
$("mode").addEventListener("change", () =>
  emit({ type: "mode", at: now, mode: $("mode").value })
);
$("advance").addEventListener("click", () => {
  now += 5000;
  emit({ type: "tick", at: now });
});
$("export").addEventListener("click", () => {
  const data = {
    format: "cosmo-lab-0.1",
    scenario: $("scenario").value,
    simulated: true,
    lanes,
  };
  const json = JSON.stringify(data, null, 2);
  $("export-json").value = json;
  $("export-panel").hidden = false;
  $("export-panel").open = true;
  const url = URL.createObjectURL(
    new Blob([json], { type: "application/json" })
  );
  const a = el("a");
  a.href = url;
  a.download = "cosmo-replay.json";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
reset();
