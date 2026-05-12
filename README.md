# SquawkAI

SquawkAI è un chatbot locale progettato per rispondere a domande aeronautiche consultando le pubblicazioni AIP disponibili sul computer dell’utente.

L’obiettivo è offrire un assistente affidabile per piloti e operatori del settore, capace di unire consultazione documentale, pianificazione rotta e supporto meteo in un’unica interfaccia semplice.

## Cosa fa il progetto

SquawkAI permette di:

- leggere e interpretare documentazione aeronautica (AIP e altri PDF locali);
- rispondere a domande su regole di volo nazionali, procedure aeroportuali e comunicazioni operative;
- generare una rotta e mostrarla su una cartina virtuale;
- integrare dati meteo di rotta tramite servizi METAR e TAF;
- evolvere verso un controllo automatico della rotta con integrazione Eurocontrol (funzionalità prevista).

## Come utilizzarlo (flusso previsto)

1. **Carica/indica i documenti locali** (AIP, procedure, regolamenti, etc.).
2. **Indicizza i contenuti** nel database locale.
3. **Apri l’interfaccia web** e avvia la conversazione con SquawkAI.
4. **Fai domande operative** (regole, meteo, procedure, comunicazioni).
5. **Genera e visualizza la rotta** su mappa, con supporto alle informazioni meteo disponibili.

## Funzionalità principali

- **Q&A aeronautico locale** basato sui documenti presenti sul PC.
- **Comprensione documentale PDF** per estrarre informazioni operative utili.
- **Pianificazione rotta** con visualizzazione geografica interattiva.
- **Supporto meteo di rotta** tramite METAR/TAF.
- **Indicizzazione locale** dei documenti con SQLite.
- **Estensibilità** verso verifica rotta su servizi esterni (es. Eurocontrol).

## Stack tecnologico

### Backend
- **Python**
- **FastAPI**

### Frontend
- **WebView** con **SPA in Svelte**

### Intelligenza Artificiale
- **Gemini** (scelta per capacità nativa di lettura PDF)

### Dati e persistenza
- **SQLite locale** per indicizzazione e ricerca documentale

### Mappe e visualizzazione rotta
- **Leaflet** per cartografia e rappresentazione della rotta

### Integrazioni esterne (previste)
- Servizi **METAR/TAF** (provider da definire)
- Verifica automatica rotta con **Eurocontrol** (se fattibile)

## Utenti target

- Piloti VFR/IFR
- Flight dispatcher e operatori aeronautici
- Studenti pilota e appassionati che vogliono consultare documentazione tecnica in modo più rapido

## Visione

SquawkAI vuole diventare un copilota digitale locale: veloce da consultare, trasparente nelle fonti documentali e utile sia per utenti esperti sia per chi è in formazione.
