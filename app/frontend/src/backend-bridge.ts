import { Metar, Taf } from "./lib/types";
declare const qt: { webChannelTransport: unknown } | undefined;

interface BackendBridge {
	getAirportWeather(icaoId: string): Promise<{ metar: Metar | null; taf: Taf | null }>;
}

let bridge: BackendBridge;

if (typeof qt === 'undefined') {
	bridge = {
		getAirportWeather: async (icaoId: string) => {
			if (!icaoId) return { metar: null, taf: null };
			try {
				interface AirportWeatherResponse {
					metar: Metar | null;
					taf: Taf | null;
				}

				const httpResponse = await fetch(`/ajax/airport-weather?icao=${icaoId}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'User-Agent': 'SquawkAI/1.0 (contact: gujojo@hotmail.it)'
					}
				});
				const response = await httpResponse.json() as AirportWeatherResponse;

				return {
					metar: response.metar || null,
					taf: response.taf || null
				};
			} catch (error) {
				throw new Error(`Failed to fetch weather data for ${icaoId}: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
	}
} else {
	bridge = {} as BackendBridge;
}

export { bridge };