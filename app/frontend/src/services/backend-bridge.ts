import { QWebChannel, QWebChannelTransport, type QWebChannelInstance } from "../lib/qwebchannel.js";
import type { Metar, Taf } from "../lib/types";
declare const qt: { webChannelTransport: unknown } | undefined;

interface BackendBridge {
	getAirportWeather(icaoId: string): Promise<{ metar: Metar | null; taf: Taf | null }>;
}

let bridge: BackendBridge;

if(import.meta.env.DEV) {
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
		}
	}
} else {
	if (typeof qt === 'undefined') {
		throw new Error('Qt WebChannel transport is not available. Make sure to run this application within the appropriate environment.');
	}

	new QWebChannel(qt.webChannelTransport as QWebChannelTransport, (channel: QWebChannelInstance) => {
		bridge = {
			getAirportWeather: async (icaoId: string) => {
				return new Promise((resolve, reject) => {
					try {
						let timer = setTimeout(() => {
							reject(new Error('Backend method call timed out after 30 seconds'));
						}, 30000);
						channel.objects.bridge.get_airport_weather(icaoId, (response: { metar: Metar | null; taf: Taf | null } | { error: string }) => {
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
			}
		}
	});
}

export { bridge };