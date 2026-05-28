import { QWebChannel, type QWebChannelTransport, type QWebChannelInstance } from "../lib/qwebchannel.js";
import type { Metar, Taf } from "../lib/types";
declare const qt: { webChannelTransport: unknown } | undefined;

interface BackendBridge {
	getAirportWeather(icaoId: string): Promise<{ metar: Metar | null; taf: Taf | null }>;
	getSetting(key: string): Promise<string | null>;
	setSetting(key: string, value: string | boolean | number): Promise<void>;
	indexNewFiles(): Promise<{ error: string | false; }>;
	indexNewFolder(): Promise<void>;
}

let bridge: BackendBridge;

if(typeof qt === 'undefined' && import.meta.env.DEV) {
	// Mock implementation for development environment
	bridge = {
		getAirportWeather: async (icaoId: string) => {
			// Return mock data
			let response = await fetch('https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://aviationweather.gov/api/data/metar?ids=' + icaoId + '&format=json'));
			let metar = await response.json();
			response = await fetch('https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://aviationweather.gov/api/data/taf?ids=' + icaoId + '&format=json'));
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
			return { error: false };
		},
		indexNewFolder: async () => {
			// Mock implementation, does nothing
			console.log('Indexing new folder (mock)');
		}
	}
} else {
	if (typeof qt === 'undefined') {
		throw new Error('Qt WebChannel transport is not available. Make sure to run this application within the appropriate environment.');
	}

	let webChannel: QWebChannelInstance | null = null;

	const getWebChannel = (): Promise<void> => {
		return new Promise((resolve) => {
			new QWebChannel(qt.webChannelTransport as QWebChannelTransport, (channel: QWebChannelInstance) => {
				webChannel = channel;
				resolve();
			});
		})
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
					if (result === null) {
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
			return new Promise((resolve) => {
				webChannel!.objects.bridge.index_new_files(resolve);
			});
		},
		indexNewFolder: async () => {
			webChannel || await getWebChannel();
			return new Promise((resolve) => {
				webChannel!.objects.bridge.index_new_folder(resolve);
			});
		},
	};
}

export { bridge };