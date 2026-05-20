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
			const metarList: Metar[] = [{"icaoId":"KBOS","receiptTime":"2026-05-20T09:59:36.848Z","obsTime":1779270840,"reportTime":"2026-05-20T10:00:00.000Z","temp":20,"dewp":17.8,"wdir":210,"wspd":9,"visib":"10+","altim":1011.6,"slp":1011.5,"qcField":12,"metarType":"METAR","rawOb":"METAR KBOS 200954Z 21009KT 10SM FEW170 SCT250 20/18 A2987 RMK AO2 SLP115 T02000178 $","lat":42.3606,"lon":-71.0097,"elev":4,"name":"Boston/Logan Intl, MA, US","cover":"SCT","clouds":[{"cover":"FEW","base":17000},{"cover":"SCT","base":25000}],"fltCat":"VFR"},{"icaoId":"KMCI","receiptTime":"2026-05-20T09:57:14.691Z","obsTime":1779270780,"reportTime":"2026-05-20T10:00:00.000Z","temp":7.8,"dewp":7.2,"wdir":20,"wspd":6,"visib":"10+","altim":1024.8,"slp":1024.5,"qcField":4,"metarType":"METAR","rawOb":"METAR KMCI 200953Z 02006KT 10SM SCT250 08/07 A3026 RMK AO2 SLP245 T00780072","lat":39.2975,"lon":-94.7309,"elev":308,"name":"Kansas City Intl, MO, US","cover":"SCT","clouds":[{"cover":"SCT","base":25000}],"fltCat":"VFR"},{"icaoId":"KORD","receiptTime":"2026-05-20T09:54:20.220Z","obsTime":1779270660,"reportTime":"2026-05-20T10:00:00.000Z","temp":11.7,"dewp":5.6,"wdir":350,"wspd":10,"visib":"10+","altim":1022.1,"slp":1021.9,"qcField":12,"metarType":"METAR","rawOb":"METAR KORD 200951Z 35010KT 10SM BKN033 BKN250 12/06 A3018 RMK AO2 SLP219 T01170056 $","lat":41.9602,"lon":-87.9316,"elev":202,"name":"Chicago/O'Hare Intl, IL, US","cover":"BKN","clouds":[{"cover":"BKN","base":3300},{"cover":"BKN","base":25000}],"fltCat":"VFR"}];
			const tafList: Taf[] = [{"icaoId":"KORD","dbPopTime":"2026-05-20T08:52:15.598Z","bulletinTime":"2026-05-20T08:52:00.000Z","issueTime":"2026-05-20T08:52:00.000Z","validTimeFrom":1779267600,"validTimeTo":1779364800,"rawTAF":"TAF KORD 200852Z 2009/2112 33012KT P6SM BKN035 BKN200 FM201200 03014KT P6SM SCT035 SCT250 FM210100 06008KT P6SM FEW030 BKN250","mostRecent":1,"remarks":" AMD","lat":41.96017,"lon":-87.93161,"elev":202,"prior":0,"name":"Chicago/O'Hare Intl","fcsts":[{"timeFrom":1779267600,"timeTo":1779278400,"timeBec":null,"fcstChange":null,"probability":null,"wdir":330,"wspd":12,"wgst":null,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"BKN","base":3500,"type":null},{"cover":"BKN","base":20000,"type":null}],"icgTurb":[],"temp":[]},{"timeFrom":1779278400,"timeTo":1779325200,"timeBec":null,"fcstChange":"FM","probability":null,"wdir":30,"wspd":14,"wgst":null,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"SCT","base":3500,"type":null},{"cover":"SCT","base":25000,"type":null}],"icgTurb":[],"temp":[]},{"timeFrom":1779325200,"timeTo":1779364800,"timeBec":null,"fcstChange":"FM","probability":null,"wdir":60,"wspd":8,"wgst":null,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"FEW","base":3000,"type":null},{"cover":"BKN","base":25000,"type":null}],"icgTurb":[],"temp":[]}]},{"icaoId":"KBOS","dbPopTime":"2026-05-20T08:46:21.628Z","bulletinTime":"2026-05-20T08:46:00.000Z","issueTime":"2026-05-20T08:46:00.000Z","validTimeFrom":1779267600,"validTimeTo":1779364800,"rawTAF":"TAF KBOS 200846Z 2009/2112 23007KT P6SM FEW250 FM201400 25010G18KT P6SM FEW240 FM201600 27011G20KT P6SM FEW170 FM201800 28013G22KT P6SM SCT100 PROB30 2018/2020 4SM -SHRA BKN100 FM210000 28009KT P6SM SCT100 FM210600 34010KT P6SM SCT150","mostRecent":1,"remarks":" AMD","lat":42.36057,"lon":-71.00974,"elev":4,"prior":2,"name":"Boston/Logan Intl","fcsts":[{"timeFrom":1779267600,"timeTo":1779285600,"timeBec":null,"fcstChange":null,"probability":null,"wdir":230,"wspd":7,"wgst":null,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"FEW","base":25000,"type":null}],"icgTurb":[],"temp":[]},{"timeFrom":1779285600,"timeTo":1779292800,"timeBec":null,"fcstChange":"FM","probability":null,"wdir":250,"wspd":10,"wgst":18,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"FEW","base":24000,"type":null}],"icgTurb":[],"temp":[]},{"timeFrom":1779292800,"timeTo":1779300000,"timeBec":null,"fcstChange":"FM","probability":null,"wdir":270,"wspd":11,"wgst":20,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"FEW","base":17000,"type":null}],"icgTurb":[],"temp":[]},{"timeFrom":1779300000,"timeTo":1779321600,"timeBec":null,"fcstChange":"FM","probability":null,"wdir":280,"wspd":13,"wgst":22,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"SCT","base":10000,"type":null}],"icgTurb":[],"temp":[]},{"timeFrom":1779300000,"timeTo":1779307200,"timeBec":null,"fcstChange":"PROB","probability":30,"wdir":null,"wspd":null,"wgst":null,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":4,"altim":null,"vertVis":null,"wxString":"-SHRA","notDecoded":null,"clouds":[{"cover":"BKN","base":10000,"type":null}],"icgTurb":[],"temp":[]},{"timeFrom":1779321600,"timeTo":1779343200,"timeBec":null,"fcstChange":"FM","probability":null,"wdir":280,"wspd":9,"wgst":null,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"SCT","base":10000,"type":null}],"icgTurb":[],"temp":[]},{"timeFrom":1779343200,"timeTo":1779364800,"timeBec":null,"fcstChange":"FM","probability":null,"wdir":340,"wspd":10,"wgst":null,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"SCT","base":15000,"type":null}],"icgTurb":[],"temp":[]}]},{"icaoId":"KMCI","dbPopTime":"2026-05-20T05:20:31.368Z","bulletinTime":"2026-05-20T05:20:00.000Z","issueTime":"2026-05-20T05:20:00.000Z","validTimeFrom":1779256800,"validTimeTo":1779343200,"rawTAF":"TAF KMCI 200520Z 2006/2106 02007KT P6SM OVC090 FM210100 06007KT P6SM FEW220","mostRecent":1,"remarks":"","lat":39.29747,"lon":-94.73087,"elev":308,"prior":1,"name":"Kansas City Intl","fcsts":[{"timeFrom":1779256800,"timeTo":1779325200,"timeBec":null,"fcstChange":null,"probability":null,"wdir":20,"wspd":7,"wgst":null,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"OVC","base":9000,"type":null}],"icgTurb":[],"temp":[]},{"timeFrom":1779325200,"timeTo":1779343200,"timeBec":null,"fcstChange":"FM","probability":null,"wdir":60,"wspd":7,"wgst":null,"wshearHgt":null,"wshearDir":null,"wshearSpd":null,"visib":"6+","altim":null,"vertVis":null,"wxString":null,"notDecoded":null,"clouds":[{"cover":"FEW","base":22000,"type":null}],"icgTurb":[],"temp":[]}]}];
			return {
				metar: metarList[Math.floor(Math.random() * metarList.length)],
				taf: tafList[Math.floor(Math.random() * tafList.length)]
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