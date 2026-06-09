import { QWebChannel, type QWebChannelTransport, type QWebChannelInstance } from "../lib/qwebchannel.js";
import type { Metar, Taf } from "../lib/types";
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
	newMapMarker(callback: (latitude: number, longitude: number, name: string, panTo: boolean) => void): void;
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
		newMapMarker: async (callback: (latitude: number, longitude: number, name: string, panTo: boolean) => void) => {
			webChannel || await getWebChannel();
			webChannel!.objects.bridge.new_map_marker.connect(callback);
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
				{ name: 'sample.pdf', path: '/path/to/sample.pdf', nation: 'US', section: 'GEN', section_code: 'GEN', airac: '2301', title: 'Sample Document', summary: 'A sample document for demonstration purposes.' },
				{ name: 'example.pdf', path: '/path/to/example.pdf', nation: 'US', section: 'GEN', section_code: 'GEN', airac: '2301', title: 'Example Document', summary: 'An example document for demonstration purposes.' },
				{ name: 'test.pdf', path: '/path/to/test.pdf', nation: 'IT', section: 'GEN', section_code: 'GEN', airac: '2301', title: 'Test Document', summary: 'A test document for demonstration purposes.' }
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
			callback('This is a message received from the backend (mock).');
		},
		newThread: async () => {
			console.log('New thread created (mock)');
		},
		newMapMarker: async (callback: (latitude: number, longitude: number, name: string, panTo: boolean) => void) => {
			// Mock implementation, does nothing
		}
	}	
} else {
	alert('QWebChannel is not supported in this environment. The application may not function correctly.');
	throw new Error('QWebChannel is not supported in this environment. Backend bridge cannot be initialized.');
}

export { bridge };