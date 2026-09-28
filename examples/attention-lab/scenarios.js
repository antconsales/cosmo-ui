const request = (
  id,
  principalId,
  title,
  kind = "inform",
  validForMs = 30000
) => ({
  type: "submit",
  at: 0,
  principalId,
  blockedOnHuman: kind === "ask",
  request: {
    id,
    kind,
    title,
    detail:
      kind === "ask"
        ? "Il lavoro attende questa scelta. Nessuna risposta viene inviata automaticamente."
        : "Aggiornamento simulato. Non richiede una decisione.",
    validForMs,
    options:
      kind === "ask"
        ? ["Includi il trimestre precedente", "Solo il trimestre attuale"]
        : [],
  },
});
export const scenarios = {
  mixed: {
    label: "Tre agenti, una decisione",
    events: [
      request("research-1", "Research", "Analisi delle fonti completata"),
      request("build-1", "Builder", "Prima versione del report pronta"),
      request(
        "review-1",
        "Reviewer",
        "Quale periodo deve coprire il report?",
        "ask"
      ),
    ],
  },
  noise: {
    label: "Molti aggiornamenti",
    events: [
      ...Array.from({ length: 8 }, (_, n) =>
        request(
          `progress-${n}`,
          "Builder",
          `Elaborazione: passaggio ${n + 1} di 8`
        )
      ),
      request("research-1", "Research", "Fonti disponibili"),
      request(
        "review-1",
        "Reviewer",
        "Quale periodo deve coprire il report?",
        "ask"
      ),
    ],
  },
  focus: {
    label: "Concentrazione e riesame",
    events: [
      { type: "mode", at: 0, mode: "focused" },
      request("research-1", "Research", "Analisi disponibile"),
      request("build-1", "Builder", "Report pronto"),
      request("review-1", "Reviewer", "Scelta in attesa", "ask"),
    ],
  },
  expiry: {
    label: "Nessuna risposta",
    events: [
      request("research-1", "Research", "Analisi disponibile"),
      request("build-1", "Builder", "Report pronto"),
      request(
        "review-1",
        "Reviewer",
        "Scelta valida per 10 secondi",
        "ask",
        10000
      ),
    ],
  },
  retry: {
    label: "Retry e deduplicazione",
    events: [
      request("research-1", "Research", "Analisi disponibile"),
      request("build-1", "Builder", "Report pronto"),
      request("review-1", "Reviewer", "Scelta in attesa", "ask"),
      request("review-1", "Reviewer", "Scelta in attesa", "ask"),
    ],
  },
};
