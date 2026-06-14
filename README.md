# SquawkAI 🦅

SquawkAI è un **copilota digitale locale** con chat AI pensato per piloti e operatori aeronautici. Unisce in un'unica applicazione desktop consultazione documentale (AIP/PDF), meteo operativo (METAR/TAF), visualizzazione cartografica e assistenza contestuale via chat.

![SquawkAI Screenshot]()

## Perché è utile

SquawkAI riduce il tempo necessario a cercare informazioni operative sparse tra fonti diverse e le trasforma in decisioni pratiche.

- **Briefing pre-volo rapido**: chiedi in chat una sintesi di meteo e vincoli operativi per la tua rotta.
- **Consultazione documentale contestuale**: durante la preparazione, la chat richiama automaticamente procedure AIP pertinenti.
- **Pianificazione rotta interattiva**: la conversazione può evolvere in una proposta di rotta con marker e linee visualizzati sulla mappa.
- **Spiegazione visiva**: procedure complesse possono essere rappresentate graficamente sulla mappa.

Problemi risolti:

- frammentazione tra documenti, meteo e strumenti separati;
- tempi lunghi di consultazione e cross-check;
- difficoltà nel passare da informazioni testuali a visione spaziale/operativa.

## Funzionalità

### 💬 Chat con AI

- Chat multi-turno con memoria di conversazione.
- Risposte in markdown con sintassi evidenziata.
- Streaming incrementale della risposta.
- Pulsante **New Chat** per resettare il thread.
- Invio con `Enter`, nuova riga con `Shift+Enter`.
- Disabilitazione automatica dell'input durante l'elaborazione.

### 🤖 Integrazione con modelli Google AI

- Configurazione della **Google API Key** direttamente dall'app.
- Selezione del modello tra tutti quelli disponibili (es. Gemini 1.5/2.0, etc.).
- Elenco modelli scoperto automaticamente dall'API e filtrato (esclusi modelli TTS, image, robotics, etc.).
- L'assistente ha accesso a strumenti per:
  - recuperare METAR/TAF;
  - consultare i documenti indicizzati;
  - leggere e modificare lo stato della mappa (aggiungere marker e linee).

### 🗺️ Mappa interattiva

- Mappa di navigazione VFR basata su **open flightmaps** con tile raster.
- Visualizzazione di **marker** (punti) e **linee** (rotte) condivisi tra chat e mappa.
- L'assistente AI può leggere e aggiornare la mappa in autonomia.
- Reattività automatica della mappa ai cambiamenti di stato.
- Controlli di zoom e navigazione.

### 📄 Raccolta documentale

- Indicizzazione di **file PDF** (singoli o intere cartelle) tramite selettore nativo.
- Estrazione automatica dei metadati (nazione, sezione AIP, AIRAC, titolo e riepilogo) tramite AI.
- Albero documenti navigabile gerarchicamente per **nazione → sezione AIP → documento**.
- Schede collassabili per una navigazione compatta.
- Rimozione di documenti dall'indice con conferma.
- Indice persistentemente salvato nelle impostazioni dell'app.

### 🌤️ Meteo operativo

- Ricerca METAR e TAF per codice ICAO.
- Schede multiple per diversi aeroporti, con refresh e chiusura singola.
- Visualizzazione raw (report testuale) e sintetica con indicatori per:
  - **categoria volo** (VFR/MVFR/IFR — con codici colore);
  - **vento** (direzione, intensità e raffiche);
  - **visibilità**;
  - **nubi** (copertura e altezza).
- Dati cachati in memoria per consultazione rapida.
- Richieste concorrenti bloccate per evitare chiamate multiple.

### ⚙️ Impostazioni

- **Google API Key**: configurabile e salvata automaticamente.
- **Modello AI**: selezionabile da menù a tendina popolato dall'API di Google.

### 🖥️ Comportamento ambiente

- **DEV**: finestra DevTools del browser integrata, menù contestuale abilitato, collegamento a `localhost:5173` (Vite dev server).
- **PROD**: caricamento da build locale (`dist/index.html`), nessun DevTools, menù contestuale disabilitato.

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

### Perché queste scelte tecnologiche

- **Svelte + Vite**: interfaccia reattiva e leggera, avvio rapido in sviluppo e manutenzione semplice.
- **Qt WebChannel (IPC)**: canale pulito tra frontend e backend, responsabilità ben separate.
- **Architettura locale-first**: controllo operativo completo del runtime desktop, nessuna dipendenza da cloud per il funzionamento base.

## Stack tecnologico

### Backend

- Python 3.10+
- PySide6
- httpx
- langchain + langchain-google-genai
- pydantic

### Frontend

- Svelte 5
- Vite 8
- Sass (scss)
- MapLibre GL JS
- marked (render markdown)

## Requisiti

- Python 3.10+
- Node.js 20+
- npm

## Avvio in sviluppo locale

### 1) Frontend (Svelte)

```bash
cd app/frontend
npm ci
npm run dev
```

### 2) App desktop (Python + Qt)

In un secondo terminale:

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
# oppure: source .venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
python main.py
```

### 3) Variabili d'ambiente

Crea un file `.env` nella directory principale del progetto:

```env
NODE_ENV=development
```

Puoi anche inserire la `GOOGLE_API_KEY` nel file `.env`, ma è consigliato configurarla direttamente dall'interfaccia dell'app (pagina Settings).

## Build di produzione

```bash
cd app/frontend
npm ci
npm run build
```

L'app desktop caricherà automaticamente i file dalla cartella `app/frontend/dist/`.

## Screenshot

> *Aggiungi qui screenshot delle schermate principali: chat, mappa, documenti, meteo.*

## Licenza

ISC
