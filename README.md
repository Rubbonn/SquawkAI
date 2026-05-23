# SquawkAI

SquawkAI è un copilota digitale locale incentrato su una **chat tecnica con LLM** per supportare piloti e operatori aeronautici nella consultazione, nella pianificazione e nell’analisi operativa del volo.

L’obiettivo del progetto resta unire in un’unica applicazione:

- consultazione documentale aeronautica locale (AIP/PDF);
- supporto meteo operativo (METAR/TAF);
- pianificazione e visualizzazione rotta;
- assistenza contestuale via chat con risposta testuale e/o visualizzazione su mappa.

## Funzionalità del progetto

### Area documentale e assistente

- Indicizzazione locale di documenti aeronautici (AIP e materiali correlati).
- Chat LLM per Q&A operativo su procedure, regolamenti e comunicazioni.
- Correlazione delle risposte con dati meteo e altre fonti informative disponibili.
- Estensione prevista verso analisi documentale avanzata con supporto AI.

### Area meteo

- Ricerca meteo per aeroporto via codice ICAO.
- Recupero METAR e TAF con visualizzazione raw e sintetica.
- Schede meteo multiple con refresh e chiusura singola.
- Indicatori rapidi per categoria volo, vento, visibilità e nubi.

### Area rotta e navigazione

- Navigazione interna tra sezioni (`Weather`, `Map`, `Documents`).
- Pagina mappa dedicata alla visualizzazione rotta (in evoluzione).
- Supporto previsto a generazione rotta tramite chat con rendering su mappa.
- Possibile visualizzazione guidata di procedure direttamente su mappa a fini esplicativi.
- Integrazione prevista con controlli/validazioni rotta su servizi esterni.

## Utenti target

- Piloti VFR/IFR.
- Flight dispatcher e operatori aeronautici.
- Studenti pilota e appassionati che necessitano consultazione tecnica rapida e tracciabile.

## Architettura

### Runtime applicazione

- **Host desktop**: Python + PySide6 (`QWebEngineView`)
- **UI**: SPA Svelte 5 + Vite
- **Bridge IPC**: Qt `QWebChannel` in runtime desktop
- **Modalità sviluppo frontend**: bridge mock via fetch HTTP (con proxy CORS)

### Flusso tecnico principale (meteo)

1. L’utente inserisce un ICAO nella pagina meteo.
2. Il frontend invoca `bridge.getAirportWeather`.
3. In desktop mode, Python richiama `aviationweather.gov` (METAR + TAF).
4. Il risultato viene renderizzato in card con indicatori sintetici e raw report.

## Stack tecnologico

### Backend

- Python
- PySide6
- httpx

### Frontend

- Svelte 5
- Vite
- Sass

### Infrastruttura locale

- Qt WebEngine + Qt WebChannel (integrazione desktop/web)
- Dev Container con Xvfb + x11vnc + noVNC

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
