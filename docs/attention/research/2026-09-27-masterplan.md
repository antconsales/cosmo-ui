# COSMO
## Un runtime aperto per governare le interruzioni degli agenti

**Masterplan di ricerca e prodotto | 27 settembre 2026 | Proposta v0.1**

> Gli agenti propongono. La persona stabilisce i limiti. Cosmo coordina la presentazione e rende verificabile ogni esito.

### La decisione strategica

Costruire un piccolo runtime integrabile nelle applicazioni che ospitano più agenti. Il runtime riceve richieste di attenzione, applica regole definite dall'utente e dall'host, concede permessi limitati di presentazione e conserva uno stato esplicito delle richieste irrisolte.

Il primo prodotto è una libreria con una demo utilizzabile. Il protocollo aperto emerge dalle integrazioni e dai test di interoperabilità. L'estensione a wearable e interfacce spaziali resta la direzione di ricerca, senza diventare una dipendenza della prima release.

### L'ipotesi da dimostrare

**Quando più agenti lavorano per una persona, coordinare richieste, presentazione ed esiti può ridurre le interruzioni evitabili senza nascondere decisioni importanti o lasciare lavoro bloccato.**

Questo documento propone come verificarlo. Non presenta risultati sperimentali già ottenuti, non certifica una novità assoluta e non descrive funzionalità già implementate.

### Dove cercare originalità

Nel collegamento verificabile fra richiesta, evidenza, decisione del runtime, presentazione effettiva e risposta umana. In particolare: gestione esplicita del rinvio, contenuto minimo da preservare, comportamento in caso di mancata risposta e confronto riproducibile fra policy.

Budget, notifiche contestuali e permessi temporanei hanno precedenti. Il contributo possibile di Cosmo è una loro composizione piccola, interoperabile e valutata con utilizzatori reali.

**Posizionamento pubblico proposto:** “Cosmo is an open runtime for coordinating when agents may interrupt people, what they must preserve, and what happens when attention is unavailable.”

<!-- pagebreak -->

## 01 / Il territorio esiste già. Il contributo va guadagnato.

La ricerca rende il progetto più preciso: non siamo davanti a un campo vuoto. Le fonti qui sotto documentano precedenti e sovrapposizioni; le opportunità per Cosmo sono interpretazioni progettuali.

| Area | Evidenza pubblica | Conseguenza per Cosmo |
| --- | --- | --- |
| Attenzione e rinvio | Horvitz e colleghi studiano alert sensibili all'attenzione e bounded deferral; Iqbal studia notifiche nei punti di transizione del lavoro. [1][2][3] | Adottare queste idee come antecedenti. Confrontarsi con baseline di rinvio, non solo con notifiche immediate. |
| Budget per più agenti | DataKnife descrive budget d'interruzione e un prototipo di dashboard. È una working note, senza studio controllato esterno. [4] | “Budget d'attenzione per agenti” non basta come rivendicazione di originalità. |
| UI e flussi agentici | A2UI descrive interfacce dichiarative; AG-UI collega agenti e applicazioni tramite eventi; MCP Apps porta UI interattive nei client MCP. [5][6][7] | Integrarsi a questi livelli. Non inventare un altro trasporto o formato di componenti. |
| Richieste umane | ACP definisce richieste di permesso. Moa documenta una coda di elementi che richiedono attenzione fra sessioni. [8][9] | Una inbox o una schermata di approvazione non sono, da sole, una differenza sufficiente. |
| Controlli di piattaforma | Apple espone livelli d'interruzione; Android documenta permessi per le notifiche. [10][11] | Cosmo opera entro i vincoli dell'host e del sistema operativo. |
| Wearable e XR | XR Blocks offre strumenti per prototipare AI + XR; AHIMR'26 pone al centro tempi, forme e controllo dell'interazione mediata dall'AI. [12][13] | Usare framework esistenti e collegare il lavoro a problemi di ricerca espliciti. |

### Cosa possiamo affermare oggi

Le fonti consultate mostrano pezzi importanti della soluzione e progetti adiacenti. **Non dimostrano che nessuno stia costruendo la stessa combinazione.** Questa è una ricognizione mirata di fonti primarie, non una revisione sistematica dell'intera letteratura o un audit del codice dei concorrenti.

Anche l'uso di lease per limitare accesso comunicativo e attenzione compare in precedenti tecnici. La fonte [14] è citata soltanto per questo antecedente concettuale; qui non si valuta alcun profilo brevettuale.

<!-- pagebreak -->

## 02 / Un primo utilizzatore, un confine controllabile

### Il primo utilizzatore

Uno sviluppatore che costruisce un'applicazione web o desktop in cui una persona supervisiona più agenti. L'host conosce le sessioni, riceve gli eventi e controlla le superfici attraverso cui queste sessioni comunicano con l'utente.

**Scenario iniziale:** un agente sta completando un'analisi, uno esegue un lavoro di implementazione, uno attende una scelta. Nel frattempo l'utente sta leggendo o modificando un documento. Progressi, risultati e richieste non devono avere lo stesso diritto di interromperlo.

La scelta di questo segmento è un'ipotesi di accessibilità e misurabilità, non una conclusione di mercato. Va verificata con integratori prima di ampliare l'architettura.

### Il lavoro che Cosmo deve fare

1. Distinguere aggiornamenti informativi da richieste che richiedono una risposta.
2. Limitare le interruzioni concorrenti e raggruppare aggiornamenti compatibili.
3. Mantenere visibili e recuperabili le decisioni irrisolte, anche quando non vengono notificate.
4. Rendere comprensibile perché una richiesta è stata presentata, rinviata o rifiutata.
5. Restituire all'host un esito preciso, senza inventare consenso o completamento.

### Il confine di autorità

Cosmo controlla soltanto le superfici che l'applicazione gli affida. Non coordina automaticamente notifiche di altre app, schede indipendenti o dispositivi esterni. Un plugin può proporre una richiesta; l'identità e i permessi arrivano dall'host, non dal JSON del plugin.

Il rendering deve passare dal punto di controllo dell'host. Se gli agenti possono creare liberamente toast o audio altrove, Cosmo offre solo suggerimenti e deve dichiararlo.

### Il primo ciclo completo

**Evento reale → richiesta → policy → presentazione → risposta → aggiornamento della sessione.**

La prima integrazione può usare chiamate TypeScript dirette. La seconda deve provenire da un sistema distinto o da un integratore esterno: serve a scoprire quali assunzioni erano specifiche della demo.

Per la v0.1: un utente, un'autorità di scheduling, un host e due superfici web. Niente sincronizzazione distribuita, inferenza biometrica, guida stradale o gestione di emergenze.

<!-- pagebreak -->

## 03 / La proposta distintiva: responsabilità lungo tutto il ciclo

L'ipotesi di innovazione è **rendere interoperabile e verificabile l'intero ciclo della richiesta di attenzione**, compreso ciò che non viene mostrato. Nessun singolo elemento della tabella viene rivendicato come invenzione.

| Elemento proposto | Significato concreto | Prova necessaria |
| --- | --- | --- |
| Permesso di presentazione limitato | Il runtime concede una superficie, una modalità e una finestra temporale. Il renderer controlla che il permesso sia ancora valido. | Nessuna presentazione tramite l'adapter conforme dopo revoca, scadenza o cambio incompatibile di policy. |
| Rinvio con esito esplicito | Ogni richiesta rinviata conserva motivo, prossimo riesame e comportamento alla scadenza. | Una richiesta non scompare senza una transizione registrata. |
| Contenuto minimo preservato | L'host definisce quali dati e scelte devono restare disponibili anche in una rappresentazione compatta. | La trasformazione non perde campi obbligatori né altera le opzioni. |
| Ricevute distinte | Invio al renderer, presentazione, risposta e risoluzione sono eventi differenti. | Un evento tecnico di rendering non viene contato come comprensione o consenso. |
| Replay delle policy | La stessa sequenza registrata viene eseguita con policy diverse. | Confronti ripetibili e limiti causali dichiarati. |

### Perché potrebbe essere utile

Un normale filtro può ridurre il rumore cancellando notifiche. Cosmo deve rendere valutabile il compromesso: quante interruzioni evita, quanto tempo lascia gli agenti bloccati e quali richieste diventano tardive o restano inevase.

Il contributo più difendibile sarebbe un **contratto piccolo più un corpus di casi difficili**, utilizzabile anche da chi non adotta il renderer di Cosmo.

### Tre domande di ricerca

**R1.** Esplicitare attesa e mancata risposta migliora la supervisione rispetto a una coda con priorità e cooldown?

**R2.** Vincoli semantici verificabili permettono di cambiare presentazione senza alterare la decisione richiesta?

**R3.** Un integratore esterno riesce a riprodurre le stesse transizioni usando soltanto specifica e fixture?

Se la risposta a R1 è negativa, Cosmo può restare utile come componente di interoperabilità. Ma non va presentato come un miglioramento dimostrato dell'attenzione umana.

<!-- pagebreak -->

## 04 / Il contratto minimo

Separare tre classi di informazioni: **dichiarate dall'agente, verificate dall'host, decise dal runtime**. Un campo validato da uno schema non diventa automaticamente vero.

| Oggetto | Contenuto essenziale | Autorità |
| --- | --- | --- |
| Request | Identificatore, revisione, sessione, tipo di esigenza, riferimento al contenuto, validità richiesta | Agente; identità associata dall'host |
| Evidence | Evento di origine e fatti che l'host può verificare, per esempio una sessione realmente in attesa | Host o adapter fidato |
| Context | Modalità dichiarata, disponibilità delle superfici, fonte, istante di osservazione e scadenza | Host; dati mancanti restano ignoti |
| Policy | Permessi, limiti d'interruzione, regole di rinvio e vincoli di contenuto | Utente e host, entro i vincoli di piattaforma |
| Decision | Esito, codici di motivo, versione della policy, prossimo riesame; eventuale grant | Runtime |
| Receipt | Esito tecnico della consegna e azioni esplicite dell'utente | Adapter per la consegna; host per le azioni |

### Tipi iniziali

`inform` segnala un aggiornamento; `ask` richiede un input; `approval` rimanda a un'autorizzazione gestita dall'host. `guide`, entità spaziali e navigazione restano estensioni successive.

Per `ask` e `approval`, l'host determina se il lavoro sia realmente bloccato. L'agente può proporre importanza o urgenza in un'estensione sperimentale, ma la v0.1 non ne fa la base dell'ordinamento.

### Tre tempi diversi

**Validità del contenuto:** quando l'informazione o la domanda diventano obsolete. **Scadenza della decisione richiesta:** quando una risposta sarebbe utile, con fonte e attendibilità. **Scadenza del grant:** quando finisce il permesso di iniziare o mantenere una presentazione.

Questi tempi non vanno compressi in un unico `expiresInMs`. Il runtime registra ricezione e ordine con il proprio clock; tratta gli orari esterni come dichiarazioni da normalizzare.

### Limiti del contratto

Il grant autorizza la presentazione, mai l'azione sottostante. Una richiesta approvativa conserva identificatore, revisione e opzioni dell'host. Una risposta a una versione obsoleta non autorizza la versione nuova. La selezione torna al sistema che possiede l'operazione e ne verifica lo stato corrente. ACP costituisce un riferimento concreto da rispettare nei suoi adapter. [8]

<!-- pagebreak -->

## 05 / Stati, ricevute e richieste irrisolte

### Separare ammissione, consegna e risoluzione

La richiesta ha stati di scheduling: `pending`, `deferred`, `granted`. Può terminare come `resolved`, `cancelled`, `expired`, `rejected` o `superseded`. La consegna mantiene ricevute separate: `rendered`, `failed`, `dismissed`. La risposta è un evento autenticato dell'host, distinto da queste ricevute.

**`rendered` significa che l'adapter dichiara di aver presentato il contenuto. Non dimostra che una persona lo abbia visto, compreso o approvato.**

Un grant può scadere mentre la richiesta rimane valida. In questo caso il runtime riesamina la richiesta secondo la policy; non la segna automaticamente come risolta e non la ripresenta senza limiti.

### Comportamento del rinvio

Ogni decisione `deferred` contiene un motivo stabile e una condizione di riesame: cambio di modalità, slot libero, timer o azione esplicita. Un timer garantisce che non si attenda soltanto un evento che potrebbe non arrivare.

Al riesame vengono controllati di nuovo validità, cancellazione, policy e contenuto. Alla scadenza una richiesta termina con esito esplicito; l'eventuale lavoro ancora bloccato rimane indicato nell'host e può generare una nuova richiesta solo secondo regole definite.

### Silenzio e attenzione non disponibile

Se l'utente non risponde, Cosmo notifica all'host l'assenza di risposta. Per le approvazioni non ricava mai un “sì” da un timeout, un dismiss o una ricevuta di rendering.

Una limitazione delle interruzioni non deve rendere invisibili le richieste: l'inbox dell'host espone sempre quelle irrisolte consentite, con età, motivo dell'attesa e possibilità di rispondere o annullare.

### Garanzie verificabili

- Stessa richiesta e revisione: elaborazione idempotente, nessun nuovo toast per un retry.
- Nuova revisione: vecchi grant invalidati, associazione a risposte esplicita.
- Cancellazione: vietate nuove presentazioni; l'adapter chiude quelle revocabili.
- Errori e riavvii: nessun successo inventato; stato recuperato oppure esito di perdita dello stato dichiarato.
- Saturazione: limiti di coda e backpressure visibili al chiamante. Le richieste rifiutate per capacità non vengono fingentemente accettate.

<!-- pagebreak -->

## 06 / Scheduling semplice, contesto onesto

### Prima i vincoli, poi le preferenze

1. Verificare identità, schema, dimensioni, revisione e permessi della fonte.
2. Applicare i vincoli obbligatori della piattaforma e dell'host e le restrizioni dell'utente. Un conflitto senza soluzione produce un esito esplicito.
3. Escludere contenuti scaduti e modalità incompatibili con accessibilità o riservatezza.
4. Classificare richieste e scadenze usando evidenze disponibili all'host.
5. Applicare limiti d'interruzione, cooldown e quote per fonte autenticata.
6. Ordinare gli elementi ammissibili, selezionare una presentazione valida, emettere decisione e trace.

Le preferenze dell'utente scelgono fra possibilità consentite; non possono creare capacità assenti o annullare un vincolo obbligatorio dell'host. Un agente non può autoassegnarsi una categoria di emergenza.

### Policy di riferimento v0.1

Aggiornamenti informativi nella superficie periferica. Richieste verificate come bloccanti nell'inbox delle decisioni. Al massimo una nuova interruzione attiva per volta; cooldown configurabile e ordinamento deterministico per classe, scadenza verificata, tempo d'attesa e sequenza d'ingresso.

All'interno di classi equivalenti, una rotazione per fonte limita il monopolio. L'attesa aumenta la visibilità nella coda, senza scavalcare un divieto esplicito. Identità create dall'agente non moltiplicano la quota: il gruppo responsabile è assegnato dall'host.

### Nessun finto misuratore della mente

La v0.1 usa modalità manuali, per esempio “disponibile”, “concentrato” e “non interrompere”. Disponibilità di una finestra e stato della sessione sono osservazioni tecniche, non misure del carico cognitivo.

Ogni segnale di contesto ha fonte, timestamp e validità. Un contesto obsoleto diventa `unknown`. La policy di fallback è esplicita: superficie periferica consentita, nessuna nuova interruzione non autorizzata, richieste recuperabili nell'inbox.

### Nessun LLM nel percorso necessario

La prima release non include un provider semantico. Un modello futuro potrà proporre classificazioni o alternative entro vincoli già applicati. Timeout, versioni e output del provider dovranno essere registrati per il replay; un'autovalutazione di confidence non sarà considerata una probabilità calibrata.

<!-- pagebreak -->

## 07 / Espressione: preservare il significato

La scala L0-L4 del masterplan originario mescola ricchezza visiva, costo e appropriatezza. Per Cosmo è più utile descrivere capacità indipendenti: testo disponibile, input possibile, audio consentito, riservatezza della superficie, durata e requisiti di accessibilità.

### Due presentazioni nella prima release

**Periferica:** aggiornamento persistente e discreto dello stato. **Interattiva:** scheda che rende accessibili contenuto, opzioni e risposta. Sono entrambe web; non occorre costruire un motore grafico.

La scelta dipende dalla richiesta e dalla policy. Per le approvazioni, un indicatore periferico può segnalare “decisione in attesa”, ma non è una presentazione sufficiente per raccogliere consenso.

### Il contenuto minimo

Il profilo dell'host definisce campi che una presentazione non può perdere: operazione richiesta, oggetto, conseguenze rilevanti, opzioni consentite e riferimento alla versione. Le varianti passano attraverso template deterministici con controlli sui campi obbligatori.

Esempio: “Pubblicare il report clienti nello spazio condiviso del team?” non può diventare semplicemente “Continuare?”. Se una superficie non può mostrare gli elementi necessari, Cosmo rinvia la decisione o propone l'apertura di una superficie adeguata.

**Ogni richiesta deve avere un esito valido, non necessariamente una rappresentazione minima valida su ogni dispositivo.**

### Dove può nascere ricerca utile

Una futura “prova di preservazione” può attestare che i campi richiesti esistono nella variante resa. Non dimostra equivalenza semantica di riassunti liberi, leggibilità o comprensione umana: queste richiedono valutazione separata.

Per wearable, una vibrazione potrà segnalare l'esistenza di una richiesta; un telefono potrà contenerne i dettagli. Il trasferimento dovrà preservare identità, revisione e stato della risposta. Non si presume che una vibrazione equivalga a una scheda.

### Prestazioni ed energia

Nella v0.1 si misurano dimensione del pacchetto, latenza e memoria. Costi energetici o “carico cognitivo risparmiato” non si deducono dal numero di pixel o dal livello grafico. I profili energetici arriveranno solo dopo misure su dispositivi reali.

<!-- pagebreak -->

## 08 / Architettura e primo esempio

```text
Eventi degli agenti
       |
Adapter dell'host: identità, evidenze, contenuto
       |
Cosmo: ammissione -> scheduling -> grant + trace
       |                               |
Adapter di presentazione          Store dell'host
       |
Superficie periferica / scheda interattiva
       |
Ricevuta tecnica o risposta esplicita -> host -> Cosmo
```

**Core:** TypeScript, guidato da eventi, nessuna rete, DOM, React o dipendenza LLM. Il reducer riceve stato precedente, evento normalizzato, tempo esplicito e policy versionata. Produce stato nuovo ed effetti da eseguire nell'host.

**Host:** autenticazione, persistenza, clock, timer, validazione delle azioni e collegamento agli agenti. **Adapter di presentazione:** controlla grant e revisione prima di mostrare il contenuto, gestisce revoche e produce ricevute.

### Esempio di envelope normalizzato, non API pubblicata

```json
{
  "protocol": "cosmo/0.1-draft",
  "requestId": "review-42", "revision": 1,
  "principalId": "host:agent-reviewer",
  "sessionId": "session-7", "kind": "ask",
  "contentRef": "host:question-42:v1",
  "evidence": {
    "source": "host", "blockedOnHuman": true
  },
  "validForMs": 300000,
  "noResponse": "report-unanswered"
}
```

`principalId` ed `evidence` vengono inseriti dall'host e non accettati ciecamente dal payload dell'agente. Il contenuto referenziato deve essere disponibile e validato prima del grant.

Per il replay servono anche ordine degli eventi, clock, stato iniziale, profilo delle capacità, policy e versione dell'algoritmo. “Stessi input” non significa soltanto lo stesso JSON della richiesta.

Nel prototipo il grant è un identificatore opaco verificato dall'host, non un token di sicurezza distribuito. Il protocollo fissa gli invarianti; la policy di riferimento fissa le scelte di scheduling. Due policy conformi possono scegliere tempi diversi: soltanto replay dello stesso profilo e della stessa versione devono coincidere.

<!-- pagebreak -->

## 09 / Valutazione: qualità prima della velocità

Il benchmark deve poter mostrare che Cosmo non aggiunge valore. Separare tre livelli: conformità meccanica, simulazione delle policy e utilità per le persone.

### A. Conformità e robustezza

Fixture per cancellazioni, revoche, scadenze, retry duplicati, eventi fuori ordine, riavvio, contesto obsoleto, renderer indisponibile, richieste modificate durante la risposta e saturazione della coda. Property test per invarianti; fuzzing per payload malformati.

Misurare p50/p95/p99, tempo di validazione, costo delle trace e memoria con 10, 100 e 1.000 richieste. Dichiarare macchina, runtime, corpus e commit. Obiettivo preliminare: p95 sotto 5 ms con 100 richieste sul dispositivo di riferimento, esclusi rendering e persistenza. È un budget da verificare, non una promessa universale.

### B. Confronto fra policy

Usare almeno quattro condizioni: notifica immediata; inbox silenziosa; priorità con cooldown e deduplica; rinvio limitato con batching. Confrontare Cosmo con la migliore baseline applicabile, con le stesse capacità e gli stessi eventi. Le idee di bounded deferral e breakpoint hanno precedenti diretti. [2][3]

Metriche: numero di interruzioni, richieste utili scadute, tempo in attesa della risposta, durata del blocco del lavoro, anzianità della coda e distribuzione del servizio fra fonti. Mostrare curve di compromesso; non comprimere tutto in un punteggio arbitrario.

Il replay può confrontare le decisioni del software. Non può ricostruire come una persona avrebbe reagito a una policy diversa: non è una prova causale del beneficio umano.

### C. Studio esplorativo con persone

Primo pilot proposto: 8-12 persone che usano più agenti, con compiti realistici e condizioni controbilanciate. Serve a scoprire errori e stimare variabilità; non basta per proclamare efficacia generalizzabile. Un eventuale studio confermativo richiederà ipotesi, analisi e numerosità definite separatamente.

Registrare tempo ed errori nel compito principale, richieste mancate, ripresa del lavoro, percezione delle interruzioni e preferenza dell'utente. Etichette di utilità indipendenti dalla policy, casi avversi e scenari non usati per tararla riducono l'autoconferma.

**Gate esplorativo proposto:** cercare una riduzione mediana del 25% delle interruzioni rispetto alla baseline migliore, senza aumento osservato delle decisioni importanti mancate né peggioramento superiore al 10% del tempo di risposta. Soglie progettuali da concordare prima del pilot; riportare variabilità e casi negativi. Non equivalgono a una prova statistica di non inferiorità.

<!-- pagebreak -->

## 10 / La demo che deve poter smentire il progetto

### Una persona, tre agenti, un compito reale

Il visitatore modifica un breve documento mentre tre sessioni producono aggiornamenti, risultati e domande. Può usare modalità “disponibile”, “concentrato” o “non interrompere”. Un controllo attiva la baseline o Cosmo sullo stesso scenario.

La vista principale deve restare il lavoro umano. Accanto: stato periferico degli agenti, inbox delle decisioni e contatore degli elementi in attesa. La trace tecnica è apribile, non occupa il centro dell'esperienza.

### Cinque scenari iniziali

**Rumore:** un agente genera molti progressi; gli altri hanno aggiornamenti meno frequenti. Cosmo deve evitare che il volume di una fonte domini la presentazione.

**Decisione bloccante:** una scelta reale arresta una sessione. L'utente deve poterla trovare e risolvere anche senza toast.

**Domanda diventata obsoleta:** arriva una revisione mentre la scheda precedente è aperta. La risposta vecchia non può essere applicata alla domanda nuova.

**Contesto e superficie indisponibili:** la modalità scade o il renderer non risponde. Il sistema deve dichiarare l'incertezza e mantenere recuperabile la richiesta.

**Mancata risposta:** termina la validità di una richiesta senza risposta umana. Il risultato deve distinguere scadenza, eventuale blocco della sessione e contenuto ancora consultabile.

### Due livelli di dimostrazione

Il simulatore usa eventi deterministici e condivisibili: ideale per spiegare e riprodurre un problema. L'integrazione reale usa almeno una sorgente di eventi effettiva e un ciclo di risposta completo: necessaria per verificare che il contratto sia adottabile.

Non presentare una riproduzione registrata come esperimento su utenti. Non mostrare contatori di “attenzione risparmiata” senza definizione e misura. Non aggiungere 3D per rendere più convincente una policy non ancora confrontata.

### Il momento memorabile

L'utente apre “Perché questa richiesta aspetta?” e vede: “Modalità concentrato; domanda valida ancora 3 minuti; disponibile nell'inbox; nessuna risposta sarà inviata automaticamente”. Può rispondere, rinviare o cambiare la regola. Il controllo è concreto e reversibile.

<!-- pagebreak -->

## 11 / Roadmap con gate, non un catalogo di funzionalità

**Orizzonte iniziale: otto settimane indicative** per una persona esperta con disponibilità sostanziale. La capacità reale e l'accesso agli integratori determinano i tempi. I gate contano più delle date.

| Periodo | Risultato | Condizione per procedere |
| --- | --- | --- |
| Settimana 1 | 5 colloqui con sviluppatori/utilizzatori; esempi di flussi problematici; demo grezza a tre agenti | Almeno due candidati riconoscono il problema e accettano di provare un'integrazione. Nessun contatto è già acquisito. |
| Settimana 2 | Primo ciclo reale richiesta-presentazione-risposta; baseline semplice | Il punto di controllo è effettivo e la demo funziona senza inventare eventi essenziali mancanti. |
| Settimane 3-4 | Reducer, policy di riferimento, grant, inbox irrisolti, schema e fixture | Passano invarianti e scenari di errore; la policy è confrontabile con le baseline. |
| Settimane 5-6 | Pilot, seconda integrazione, misure e report dei casi negativi | Emergono beneficio o utilità d'integrazione credibili. Le modifiche sono guidate dai dati raccolti. |
| Settimane 7-8 | Draft pubblico, demo, documentazione breve, corpus, report | Un'altra persona può usare il contratto senza dipendere da spiegazioni private dell'autore. |

### Fermarsi o cambiare forma

Se gli host non possono o non vogliono affidare a Cosmo la presentazione, ridurre il progetto a una libreria locale di scheduling o a strumenti di valutazione.

Se una baseline con priorità e cooldown ottiene gli stessi risultati con meno costo d'integrazione, semplificare. Se il valore è nelle trace e nel corpus, promuovere quel contributo senza forzare la tesi di un protocollo universale.

Se gli integratori chiedono soltanto inoltro di notifiche, confrontare l'esigenza con relay già esistenti: AgentNotify, per esempio, documenta l'inoltro di eventi da strumenti agentici a provider di notifiche. [15]

### Definition of done della v0.1

Un host reale presenta e risolve richieste attraverso Cosmo; gli esiti restano distinti; policy e replay sono riproducibili; cinque scenari e casi avversi sono pubblici; benchmark e limiti sono documentati. Un tester esterno completa un'integrazione minima e le incompatibilità emerse vengono registrate.

Il draft non diventa “standard” perché ha JSON Schema, logo e governance. Un'implementazione indipendente è il gate successivo per parlare seriamente di interoperabilità.

<!-- pagebreak -->

## 12 / Repository, migrazione e lavoro incrementale

Il README pubblico di cosmo-ui descrive Spatial Intent, Adaptive Complexity e renderer separati. È un punto di partenza concettuale, non una verifica della qualità o della completezza dell'implementazione. Questa ricerca non ha eseguito un audit del repository. [16]

### Conservare la storia, verificare il riuso

Prima di migrare: inventario di API, dipendenze, test e utilizzatori; riferimento stabile alla versione precedente; decisione esplicita sui moduli riutilizzabili. Non spostare subito tutto in `legacy/` se interrompe import, documentazione o release esistenti.

Il nuovo runtime nasce isolato. Schemi, naming e componenti precedenti si riusano dove semantica e test lo consentono. La documentazione distingue chiaramente prototipo storico e nuovo esperimento.

### Struttura iniziale proposta

```text
spec/                  contratto draft e schema
packages/runtime/      reducer, scheduling, tipi, validazione
packages/adapter-web/  grant, revoche, ricevute
apps/lab/              demo e confronto policy
fixtures/              scenari, invarianti, casi avversi
benchmarks/            harness e risultati riproducibili
docs/                  quickstart, limiti, ricerca, decisioni
```

Policy e scheduler restano moduli interni finché non emerge un bisogno reale di versionarli separatamente. Nomi npm e disponibilità dei namespace vanno verificati prima della pubblicazione.

### Sequenza proposta di PR

**PR 1:** tesi, confine di autorità, baseline e prima demo verticale. **PR 2:** collegamento a una sorgente reale e restituzione della risposta. **PR 3:** schema, lifecycle, reducer e primi test. **PR 4:** scheduling, limiti, grant e revoche. **PR 5:** persistenza dell'host, recupero, replay e benchmark. **PR 6:** seconda integrazione, report del pilot e documentazione del draft.

Le PR sono una proposta di esecuzione futura: questo documento non autorizza né avvia modifiche al repository o pubblicazioni.

### Disciplina tecnica

Nessuna rete o UI nel core. Nessun test che confonda conformità con qualità della policy. Ogni decisione riporta regola, versione e fatti pertinenti; la trace non è una richiesta del ragionamento interno di un modello. Test di compatibilità fissati su versioni precise; estensioni sperimentali esplicite e ignorabili senza interpretazioni ambigue.

<!-- pagebreak -->

## 13 / Adozione, interoperabilità e rischi

### Inserirsi dove il controllo esiste

**AG-UI:** possibile adapter d'ingresso per eventi; non equiparare ogni evento a una richiesta di attenzione. **A2UI:** possibile rappresentazione del contenuto dopo la decisione, con cataloghi e azioni ancora controllati dall'host. **MCP Apps:** possibile superficie in un client che supporta l'integrazione; una singola app incorporata non controlla automaticamente tutte le altre. [5][6][7]

Gli adapter devono dichiarare quali eventi osservano, quali superfici governano e quali revoche possono davvero applicare. Una promessa end-to-end richiede collaborazione dell'host: non basta aggiungere metadati al payload.

### Ridurre il costo di adozione

Quickstart con un agente fittizio, poi un esempio reale. Modalità di osservazione che registra le decisioni proposte senza modificare la consegna. Attivazione esplicita della policy dopo confronto. Possibilità di rimuovere Cosmo e conservare richieste ed esiti in un formato leggibile.

Lanciare demo, runtime e report insieme. Invitare integratori e ricercatori a contribuire casi in cui Cosmo sbaglia. Una implementazione esterna o un corpus riusato conta più delle stelle GitHub.

### Rischi principali e risposte progettuali

- **Manipolazione dell'urgenza:** identità e quote dell'host; nessun privilegio assegnato da testo libero.
- **Rumore trasformato in abbandono:** inbox recuperabile, riesami e scadenze tracciati; metriche sul lavoro bloccato.
- **Consenso ambiguo:** grant, rendering e risposta sono separati; approvazione della revisione esatta.
- **Tracce invasive:** contenuto escluso per default, identificatori minimizzati, retention e cancellazione configurate dall'host. Anche metadati e hash possono rivelare informazioni.
- **Permessi revocati troppo tardi:** l'adapter controlla prima di presentare; una notifica già osservata o un suono già emesso non possono essere ritirati retroattivamente.
- **Concorrenza dei framework:** contributi modulari, test e semantiche riusabili; disponibilità a diventare un'estensione di un ecosistema esistente.

### Sostenibilità

Prima validare utilizzatori e costo d'integrazione. In seguito possono esistere servizi di integrazione o strumenti di valutazione; il protocollo e i test essenziali devono rimanere accessibili. Un modello economico che premi più interruzioni sarebbe in conflitto con la tesi del progetto.

<!-- pagebreak -->

## 14 / Wearable e ambizione di ricerca

Il desktop è il banco di prova iniziale, non il limite della visione. La domanda spaziale resta interessante: come mantiene una persona il controllo quando più agenti possono intervenire attraverso display, audio e segnali aptici?

AHIMR'26, previsto per il 5 ottobre 2026, identifica problemi di sensing, trasformazione dell'informazione e agency. È un contesto pertinente per discutere risultati e casi aperti, non una prova di adozione di Cosmo. [13]

### Tre estensioni, ciascuna con una prova

**1. Continuità tra superfici.** Un segnale discreto su un dispositivo rimanda a una decisione completa su un altro. Provare che identità, revisioni, revoche e risposte non si duplicano. Per iniziare, mantenere una sola autorità di scheduling; non promettere consegna exactly-once attraverso reti intermittenti.

**2. Rappresentazioni con requisiti preservati.** Una richiesta passa da scheda a testo breve o audio. Provare quali campi restano disponibili e misurare comprensione, errori e tempi. L'assenza di una variante valida deve produrre un rinvio o un trasferimento esplicito.

**3. Contesto incerto.** Integrare segnali di attività solo dopo aver definito fonti, permessi, freschezza e fallback. Confrontare la policy con contesto manuale, stimato e assente per scoprire quanto dipende dalla qualità del sensing.

Per rendering e accesso XR usare strumenti già esistenti: XR Blocks per prototipi, OpenXR come riferimento per l'accesso alle piattaforme XR quando pertinente. Non creare un motore o un modello del mondo per dimostrare lo scheduling. [12][17]

### Cosa renderebbe Cosmo un contributo pionieristico credibile

Un contratto riusabile che espone anche gli esiti di mancata attenzione. Un corpus pubblico di conflitti fra agenti e trasformazioni problematiche. Risultati riproducibili rispetto a baseline forti. Almeno una seconda implementazione che scopre e risolve ambiguità della specifica.

Il primato assoluto non è stabilito da questa ricerca. **L'ambizione sostenibile è diventare un riferimento precoce per implementazione, interoperabilità e valutazione di questa combinazione.**

> Costruire il minimo sistema che protegge l'attenzione senza far sparire la responsabilità. Pubblicare abbastanza evidenza perché altri possano migliorarlo o dimostrare che non funziona.

<!-- pagebreak -->

## Fonti / Ricerca e sistemi adiacenti

Fonti consultate il 27 settembre 2026. Documentazione e repository sono soggetti a modifiche. I link puntano alle fonti primarie; i risultati di ricerca non accessibili o non verificabili non fondano le conclusioni. Le valutazioni progettuali del masterplan sono proposte, non risultati delle fonti.

**[1] Horvitz, Jacobs, Hovel - Attention-Sensitive Alerting.** Precedente per il ragionamento sul valore di un alert rispetto all'attenzione. [Microsoft Research](https://www.microsoft.com/en-us/research/publication/attention-sensitive-alerting/).

**[2] Horvitz, Apacible, Subramani - Balancing Awareness and Interruption: Investigation of Notification Deferral Policies, 2005.** Precedente per rinvio limitato e compromesso fra tempestività e interruzione. [Microsoft Research](https://www.microsoft.com/en-us/research/publication/balancing-awareness-interruption-investigation-notification-deferral-policies/).

**[3] Shamsi T. Iqbal - A Framework for Intelligent Notification Management in Multitasking Domains, 2008.** Tesi sul timing delle notifiche e sui breakpoint. [University of Illinois, IDEALS](https://www.ideals.illinois.edu/items/83111).

**[4] DataKnife Research - Interruption Budgets: Rationing Human Attention Across Concurrent AI Agents, 18 giugno 2026.** Working note v0.2 dichiarata non peer reviewed; lo studio controllato esterno è indicato come non ancora svolto. [Nota degli autori](https://dataknife.io/research/interruption-budgets/).

**[5] A2UI - sito e specifica ufficiale.** Interfacce dichiarative prodotte dagli agenti e renderizzate dal client. Le versioni dell'adapter andranno fissate durante l'implementazione. [A2UI](https://a2ui.org/).

**[6] AG-UI - Overview.** Protocollo a eventi per la connessione bidirezionale tra agenti e applicazioni rivolte all'utente. [Documentazione ufficiale](https://docs.ag-ui.com/introduction).

**[7] Model Context Protocol - MCP Apps, 26 gennaio 2026.** Annuncio ufficiale dell'estensione per UI interattive nei client MCP. [MCP Blog](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/).

**[8] Agent Client Protocol - Tool Calls, protocollo v1.** Richieste di permesso e restituzione dell'opzione selezionata. [Specificazione ufficiale](https://agentclientprotocol.com/protocol/v1/tool-calls).

**[9] Moa - Web UI, Attention queue and permission decisions.** Documenta una coda informativa di richieste irrisolte fra sessioni. Fonte sulle funzionalità dichiarate; nessun test operativo svolto qui. [Documentazione del progetto](https://letmoa.run/docs/web-ui/#attention-queue-and-permission-decisions).

<!-- pagebreak -->

## Fonti / Piattaforme, XR e provenienza

**[10] Apple - UNNotificationInterruptionLevel.** Livelli che regolano importanza e modalità temporali di consegna. [Apple Developer](https://developer.apple.com/documentation/usernotifications/unnotificationinterruptionlevel).

**[11] Android - About notifications and conversations.** Concetti di piattaforma, incluso il permesso runtime per le notifiche. [Android Developers](https://developer.android.com/social-and-messaging/guides/communication/notifications-conversations).

**[12] Li e colleghi - XR Blocks: Accelerating Human-Centered AI + XR Innovation.** Framework per prototipazione AI + XR. [Google Research](https://research.google/pubs/xr-blocks-accelerating-human-centered-ai-xr-innovation/) e [repository degli autori](https://github.com/google/xrblocks).

**[13] AHIMR'26 - AI-Mediated Heads-Up Interaction in Wearable Mixed Reality.** Pagina ufficiale del workshop ISMAR previsto per il 5 ottobre 2026. Il programma è un segnale di interesse della comunità, non un risultato di validazione. [Sito degli organizzatori](https://heads-up-workshop.github.io/).

**[14] EP1608129A2 - Lease per la gestione dell'accesso interpersonale nei sistemi di comunicazione.** Documento tecnico che descrive accesso negoziato, scadenza e rinnovo. Citato come antecedente concettuale, senza analisi di stato giuridico o ambito di tutela. [Testo del documento](https://patents.google.com/patent/EP1608129A2/en).

**[15] LetTTGACO / AgentNotify - User Manual.** Relay di notifiche per eventi di strumenti agentici. Da distinguere da altri progetti omonimi. [Manuale nel repository](https://github.com/LetTTGACO/agent-notify/blob/main/docs/human-manual-en.md).

**[16] antconsales / cosmo-ui - README pubblico.** Provenienza dei concetti Spatial Intent, Adaptive Complexity e cross-reality. Consultato via pagina GitHub; le funzionalità descritte non sono state validate eseguendo il codice. [Repository](https://github.com/antconsales/cosmo-ui).

**[17] Khronos - OpenXR.** Riferimento per l'accesso alle piattaforme AR/VR. [Pagina ufficiale](https://www.khronos.org/openxr/).

### Nota sul materiale di partenza

Questa proposta rielabora criticamente il PDF fornito dall'utente, “COSMO Codex Masterplan PRO”. Conserva separazione fra intento e presentazione, core deterministico e visione cross-reality. Modifica primo mercato, perimetro, semantiche degli esiti, ordine di sviluppo e criteri di validazione.

Il documento originale è stato trattato come materiale da valutare, non come istruzioni da eseguire. Nessuna modifica al progetto, comunicazione a terzi o pubblicazione è stata effettuata per produrre questo masterplan.
