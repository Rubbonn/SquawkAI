import { QWebChannel, QWebChannelTransport, type QWebChannelInstance } from "./lib/qwebchannel.js";
import type { Metar, Taf } from "./lib/types";
declare const qt: { webChannelTransport: unknown } | undefined;

interface BackendBridge {
	getAirportWeather(icaoId: string): Promise<{ metar: Metar | null; taf: Taf | null }>;
}

let bridge: BackendBridge;

if(import.meta.env.DEV) {
	// Mock implementation for development environment
	bridge = {
		getAirportWeather: async (icaoId: string) => {
			// Simulate a delay to mimic real backend call
			await new Promise(resolve => setTimeout(resolve, 1000));
			// Return mock data
			return {
				metar: {
					raw_text: "METAR MOCK DATA",
					station_id: icaoId,
					observation_time: new Date().toISOString(),
					temperature_c: 20,
					dewpoint_c: 10,
					wind_dir_degrees: 180,
					wind_speed_kt: 15,
					visibility_statute_mi: 10,
					altim_in_hg: 29.92,
					flight_category: "VFR"
				},
				taf: {
					raw_text: "TAF MOCK DATA",
					station_id: icaoId,
					observation_time: new Date().toISOString(),
					valid_time_from: new Date().toISOString(),
					valid_time_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
					forecast: [
						{
							raw_text: "TAF FORECAST MOCK DATA",
							forecast_time_from: new Date().toISOString(),
							forecast_time_to: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
							temperature_c: 22,
							dewpoint_c: 12,
							wind_dir_degrees: 190,
							wind_speed_kt: 10,
							visibility_statute_mi: 8,
							altim_in_hg: 29.85,
							flight_category: "MVFR"
						}
					]
				}
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