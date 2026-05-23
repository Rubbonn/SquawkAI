# SquawkAI

SquawkAI è un’app desktop sperimentale per consultazione operativa meteo aeronautica, con interfaccia cockpit-style e integrazione Python ↔ Svelte tramite Qt WebChannel.

Questo README è stato aggiornato in base all’evoluzione del progetto dai commit successivi a `5b98f25`.

## Stato attuale del progetto

Attualmente il focus implementato è sul **modulo meteo aeroportuale**:

- ricerca METAR/TAF per ICAO;
- visualizzazione dati meteo in schede multiple;
- refresh e chiusura singola scheda;
- indicatori rapidi (categoria volo VFR/MVFR/IFR, vento, visibilità, nubi, dati grezzi).

Sono presenti anche:

- **sidebar con navigazione** (`Weather`, `Map`, `Documents`);
- **pagina mappa** iniziale (work in progress);
- **pagina documenti** placeholder (work in progress).

Le funzionalità chatbot/AIP pianificate inizialmente non sono ancora integrate nel codice corrente.

## Architettura

### Runtime applicazione

- **Host desktop**: Python + PySide6 (`QWebEngineView`)
- **UI**: SPA Svelte 5 + Vite
- **Bridge IPC**: Qt `QWebChannel` in runtime desktop
- **Modalità sviluppo frontend**: bridge mock via fetch HTTP (con proxy CORS)

### Flusso meteo

1. L’utente inserisce un ICAO nella pagina meteo.
2. Il frontend invoca `bridge.getAirportWeather`.
3. In desktop mode, Python richiama `aviationweather.gov` (METAR + TAF).
4. Il risultato viene renderizzato in card con indicatori sintetici e raw report.

## Struttura repository

- `/main.py`: avvio app desktop Qt + registrazione bridge WebChannel
- `/app/utils.py`: metodo backend `get_airport_weather`
- `/app/frontend`: applicazione Svelte/Vite
- `/.devcontainer`: ambiente di sviluppo con desktop remoto (VNC/noVNC)
- `/DESIGN.md`: token e linee guida visual

## Requisiti

- Python 3.10+
- Node.js 20+
- npm

Dipendenze Python principali:

- `pyside6`
- `httpx`

## Avvio in sviluppo locale

### 1) Frontend (Svelte)

```bash
cd /home/runner/work/SquawkAI/SquawkAI/app/frontend
npm ci
npm run dev
```

### 2) App desktop (Python + Qt)

In un secondo terminale:

```bash
cd /home/runner/work/SquawkAI/SquawkAI
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

## Ambiente Dev Container

Il repository include configurazione `.devcontainer` con:

- immagine `universal:linux`;
- setup automatico Xvfb + x11vnc + noVNC;
- porta `6080` per desktop remoto nel browser.

## Note implementative rilevanti dai commit recenti

- refactor progressivo del bridge frontend/backend con gestione errori e timeout;
- introduzione mock bridge per sviluppo locale;
- miglioramento design system e componentizzazione UI;
- introduzione card meteo dinamiche e ottimizzazioni bundle;
- aggiunta indicatori operativi (vento, visibilità, flight category);
- avvio iniziale della pagina mappa.
