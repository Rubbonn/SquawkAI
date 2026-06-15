import { QWebChannel, type QWebChannelTransport, type QWebChannelInstance } from "../lib/qwebchannel.js";
import type { Metar, Taf, MapState } from "../lib/types";
import type { Document } from "../state/document-index.svelte";
declare const qt: { webChannelTransport: unknown } | undefined;

interface BackendBridge {
	getAirportWeather(icaoId: string): Promise<{ metar: Metar | null; taf: Taf | null }>;
	getSetting(key: string): Promise<string | null>;
	setSetting(key: string, value: string | boolean | number): Promise<void>;
	indexNewFiles(): Promise<void>;
	indexNewFolder(): Promise<void>;
	removeDocument(name: string): Promise<void>;
	getDocuments(): Promise<Document[]>;
	documentIndexUpdated(callback: (documents: Document[]) => void): void;
	sendMessage(message: string): Promise<void>;
	messageReceived(callback: (message: string) => void): void;
	newThread(): Promise<void>;
	mapStateUpdated(callback: (state: MapState) => void): void;
}

let bridge: BackendBridge;
const hasWebChannelSupport = typeof qt !== 'undefined' && !!qt.webChannelTransport;

if(hasWebChannelSupport) {
	let webChannel: QWebChannelInstance | null = null;
	let webChannelPromise: Promise<void> | null = null;

	const getWebChannel = (): Promise<void> => {
		if(!webChannelPromise) {
			webChannelPromise = new Promise((resolve) => {
				new QWebChannel(qt.webChannelTransport as QWebChannelTransport, (channel: QWebChannelInstance) => {
					webChannel = channel;
					resolve();
				});
			});
		}
		return webChannelPromise;
	}

	bridge = {
		getAirportWeather: async (icaoId: string) => {
			webChannel || await getWebChannel();
			return new Promise((resolve, reject) => {
				try {
					let timer = setTimeout(() => {
						reject(new Error('Backend method call timed out after 30 seconds'));
					}, 30000);
					webChannel!.objects.bridge.get_airport_weather(icaoId, (response: { metar: Metar | null; taf: Taf | null } | { error: string }) => {
						clearTimeout(timer);
						if ('error' in response) {
							reject(new Error(`Backend error: ${response.error}`));
							return;
						}
						resolve(response);
					});
				} catch (error) {
					reject(new Error(`Failed to call backend method: ${error instanceof Error ? error.message : String(error)}`));
				}
			});
		},
		getSetting: async (key: string) => {
			webChannel || await getWebChannel();
			return new Promise((resolve, reject) => {
				webChannel!.objects.bridge.get_setting(key, (result: string | null) => {
					if(result === null) {
						reject(new Error(`Setting with key "${key}" not found`));
					} else {
						resolve(result);
					}
				});
			});
		},
		setSetting: async (key: string, value: string | boolean | number) => {
			webChannel || await getWebChannel();
			return new Promise((resolve) => {
				webChannel!.objects.bridge.set_setting(key, String(value), resolve);
			});
		},
		indexNewFiles: async () => {
			webChannel || await getWebChannel();
			return new Promise((resolve, reject) => {
				try {
					webChannel!.objects.bridge.index_new_files((response: { error: string | false }) => {
						if(response.error) {
							reject(new Error(`Backend error: ${response.error}`));
							return;
						}

						resolve();
					});
				} catch(error) {
					reject(new Error(`Failed to call backend method: ${error instanceof Error ? error.message : String(error)}`));
				}
			});
		},
		indexNewFolder: async () => {
			webChannel || await getWebChannel();
			return new Promise((resolve, reject) => {
				try {
					webChannel!.objects.bridge.index_new_folder((response: { error: string | false }) => {
						if(response.error) {
							reject(new Error(`Backend error: ${response.error}`));
							return;
						}

						resolve();
					});
				} catch(error) {
					reject(new Error(`Failed to call backend method: ${error instanceof Error ? error.message : String(error)}`));
				}
			});
		},
		removeDocument: async (name: string) => {
			webChannel || await getWebChannel();
			return new Promise((resolve, reject) => {
				try {
					webChannel!.objects.bridge.remove_document(name, (response: { error: string | false }) => {
						if(response.error) {
							reject(new Error(`Backend error: ${response.error}`));
							return;
						}

						resolve();
					});
				} catch(error) {
					reject(new Error(`Failed to call backend method: ${error instanceof Error ? error.message : String(error)}`));
				}
			});
		},
		getDocuments: async () => {
			webChannel || await getWebChannel();
			return new Promise((resolve, reject) => {
				try {
					webChannel!.objects.bridge.get_documents(resolve);
				} catch(error) {
					reject(new Error(`Failed to call backend method: ${error instanceof Error ? error.message : String(error)}`));
				}
			});
		},
		documentIndexUpdated: async (callback: (documents: Document[]) => void) => {
			webChannel || await getWebChannel();
			webChannel!.objects.bridge.document_index_updated.connect(callback);
		},
		sendMessage: async (message: string) => {
			webChannel || await getWebChannel();
			return new Promise((resolve, reject) => {
				try {
					webChannel!.objects.bridge.send_message(message, (response: { error: string | false }) => {
						if(response.error) {
							reject(new Error(`Backend error: ${response.error}`));
							return;
						}

						resolve();
					});
				} catch(error) {
					reject(new Error(`Failed to call backend method: ${error instanceof Error ? error.message : String(error)}`));
				}
			});
		},
		messageReceived: async (callback: (message: string) => void) => {
			webChannel || await getWebChannel();
			webChannel!.objects.bridge.message_received.connect(callback);
		},
		newThread: async () => {
			webChannel || await getWebChannel();
			return new Promise((resolve, reject) => {
				try {
					webChannel!.objects.bridge.new_thread(resolve);
				} catch(error) {
					reject(new Error(`Failed to call backend method: ${error instanceof Error ? error.message : String(error)}`));
				}
			});
		},
		mapStateUpdated: async (callback: (state: MapState) => void) => {
			webChannel || await getWebChannel();
			webChannel!.objects.bridge.map_state_updated.connect(callback);
		}
	};
} else if (import.meta.env.DEV) {
	// Mock implementation for development environment
	bridge = {
		getAirportWeather: async (icaoId: string) => {
			// Return mock data
			let response = await fetch('https://api.cors.lol/?url=' + encodeURIComponent('https://aviationweather.gov/api/data/metar?ids=' + icaoId + '&format=json'));
			let metar = await response.json();
			response = await fetch('https://api.cors.lol/?url=' + encodeURIComponent('https://aviationweather.gov/api/data/taf?ids=' + icaoId + '&format=json'));
			let taf = await response.json();
			return {
				metar: metar && metar[0],
				taf: taf && taf[0]
			}
		},
		getSetting: async (key: string) => {
			// Return mock setting value
			return window.localStorage.getItem(key) || null;
		},
		setSetting: async (key: string, value: string | boolean | number) => {
			// Store setting value in localStorage
			window.localStorage.setItem(key, String(value));
		},
		indexNewFiles: async () => {
			// Mock implementation, does nothing
			console.log('Indexing new files (mock)');
		},
		indexNewFolder: async () => {
			// Mock implementation, does nothing
			console.log('Indexing new folder (mock)');
		},
		removeDocument: async (name: string) => {
			// Mock implementation, does nothing
			console.log(`Removing document "${name}" (mock)`);
		},
		getDocuments: async () => {
			// Mock implementation, does nothing
			console.log('Fetching documents (mock)');
			return [
				{ name: 'sample.pdf', path: '/path/to/sample.pdf', nation: 'US', section: 'GEN', section_code: 'GEN', airac: '2301', title: 'Sample Document', summary: 'A sample document for demonstration purposes.', file_exists: true },
				{ name: 'example.pdf', path: '/path/to/example.pdf', nation: 'US', section: 'GEN', section_code: 'GEN', airac: '2301', title: 'Example Document', summary: 'An example document for demonstration purposes.', file_exists: true },
				{ name: 'test.pdf', path: '/path/to/test.pdf', nation: 'IT', section: 'GEN', section_code: 'GEN', airac: '2301', title: 'Test Document', summary: 'A test document for demonstration purposes.', file_exists: true }
			];
		},
		documentIndexUpdated: async (callback: (documents: Document[]) => void) => {
			// Mock implementation, does nothing
		},
		sendMessage: async (message: string) => {
			console.log('Message to backend (mock):', message);
		},
		messageReceived: async (callback: (message: string) => void) => {
			// Mock implementation, does nothing
			callback('Hello');
			callback('This is a message received from the backend (mock).');
			callback(`# Il Testo Segnaposto: Un'Esplorazione del Lorem Ipsum

## 1. Origini e utilizzi classici

Lorem ipsum dolor sit amet, **consectetur adipiscing elit**. Proin ac nisl eget purus facilisis tristique. Mauris eleifend, *sapien at sodales elementum*, dui justo eleifend lorem, id tristique nulla augue sit amet lacus. In hac habitasse platea dictumst. Curabitur sed vestibulum turpis, id porta tellus. Etiam convallis purus vitae feugiat feugiat. Sed vitae urna condimentum, elementum eros id, sodales sem.

I punti chiave dell'utilizzo del Lorem Ipsum includono:

* **Neutralità:** Permette di valutare il layout senza farsi distrarre dal significato del testo.
* **Distribuzione:** Ha una distribuzione delle lettere più o meno normale.
* **Tradizione:** Utilizzato dai tipografi fin dal XVI secolo.

## 2. Lo sviluppo nel tempo e varianti

Ut imperdiet lectus ac neque feugiat elementum. Duis id nulla ac sem feugiat pharetra vel id erat. Suspendisse potenti. Nam \`Lorem Ipsum\` non è semplicemente un testo casuale, ma ha radici nel testo classico latino del 45 a.C. Se desideri implementare una funzione per generare testo segnaposto automatizzato, potresti usare una sintassi simile a questa:

\`\`\`python
def genera_lorem(paragrafi):
    base_text = "Lorem ipsum dolor sit amet..."
    return [base_text for _ in range(paragrafi)]

\`\`\`

Nullam sit amet risus feugiat, elementum tellus non, condimentum sem. Morbi dictum scelerisque erat ac dictum.

## 3. Filosofia del design grafico

> "Il contenuto precede il design. Il design in assenza di contenuto non è design, è decorazione."
> — *Jeffrey Zeldman*

In linea con questa filosofia, il terzo paragrafo ci ricorda che Aliquam erat volutpat. Sed cursus dui eget eros dictum, eu tristique libero malesuada. Cras ac nisl rhoncus, pretium erat id, finibus nulla. Donec pretium magna id porta convallis. **Vestibulum ante ipsum primis in faucibus** orci luctus et ultrices posuere cubilia curae; Aliquam porttitor ligula sed nunc interdum, eget sodales tortor bibendum.

## 4. Applicazioni nel Web moderno

Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi interdum, lectus sed consectetur sodales, **felis lectus bibendum eros**, ut pharetra massa velit nec nisl. In questa fase dello sviluppo, gli sviluppatori usano spesso pacchetti come \`lorem-ipsum\` via npm.

Ecco i passaggi tipici per l'installazione in un progetto:

1. Aprire il terminale nella cartella di progetto.
2. Eseguire il comando di installazione: \`npm install lorem-ipsum\`.
3. Importare il modulo all'interno del file JavaScript o TypeScript.
4. Generare la quantità di testo necessaria per i componenti dell'interfaccia.

## 5. Conclusioni e considerazioni finali

Present id magna pretium, dictum sem interdum, tempor erat. Vivamus sed eros tristique, lacinia turpis non, aliquet ante. Phasellus congue, nulla vitae accumsan condimentum, *orci eros pellentesque leo*, ac sollicitudin magna diam sit amet ligula. Proin eu est a lectus efficitur vestibulum id a enim. Mauris ac elit ex. Curabitur eget nisl eget eros sodales dictum. Vivamus pellentesque mi ac sem varius, sit amet hendrerit ante facilisis. Ultrices posuere cubilia curae; Aliquam erat volutpat egestas.`);
		},
		newThread: async () => {
			console.log('New thread created (mock)');
		},
		mapStateUpdated: async (callback: (state: MapState) => void) => {
			callback({'points': [{'lat': 45.6408, 'lng': 8.7347, 'name': 'MMP VOR/DME (Malpensa)'}, {'lat': 45.6467, 'lng': 9.0217, 'name': 'SRN VOR/DME (Saronno)'}, {'lat': 45.7151, 'lng': 8.639, 'name': 'D6 MMP (RDL 318/6 NM)'}, {'lat': 45.7164, 'lng': 8.8603, 'name': 'IRKED'}, {'lat': 45.5242, 'lng': 8.7352, 'name': 'MC651'}, {'lat': 45.2375, 'lng': 8.4031, 'name': 'FARAK'}], 'lines': [{'points': [{'lat': 45.6408, 'lng': 8.7347, 'name': 'MMP VOR/DME (Malpensa)'}, {'lat': 45.7151, 'lng': 8.639, 'name': 'D6 MMP (RDL 318/6 NM)'}, {'lat': 45.7164, 'lng': 8.8603, 'name': 'IRKED (RDL 303/8 NM SRN)'}], 'name': 'IRKED 8E (RWY 35L)'}, {'points': [{'lat': 45.6408, 'lng': 8.7347, 'name': 'MMP VOR/DME (Malpensa)'}, {'lat': 45.5242, 'lng': 8.7352, 'name': 'MC651 (RDL 177/7 NM)'}, {'lat': 45.2375, 'lng': 8.4031, 'name': 'FARAK'}], 'name': 'FARAK 5Y (RWY 17L/R)'}]});
		}
	}	
} else {
	alert('QWebChannel is not supported in this environment. The application may not function correctly.');
	throw new Error('QWebChannel is not supported in this environment. Backend bridge cannot be initialized.');
}

export { bridge };