// ─── Shared ───────────────────────────────────────────────────────────────────

export type CloudCover = "CLR" | "CAVOK" | "FEW" | "SCT" | "BKN" | "OVC" | "OVX";

export interface CloudLayer {
  cover: CloudCover;
  base: number;
  top?: number;
}

// ─── METAR ────────────────────────────────────────────────────────────────────

export type MetarType = "METAR" | "SPECI" | "SYNOP" | "BUOY" | "CMAN";

export interface Metar {
  icaoId: string;
  receiptTime: string;
  obsTime: number;
  reportTime: string;
  temp: number;
  dewp: number | null;
  wdir: number | "VRB" | null;
  wspd: number | null;
  wgst: number | null;
  visib: number | string | null;
  altim: number | null;
  slp: number | null;
  wxString: string | null;
  presTend: number | null;
  maxT: number | null;
  minT: number | null;
  maxT24: number | null;
  minT24: number | null;
  precip: number | null;
  pcp3hr: number | null;
  pcp6hr: number | null;
  pcp24hr: number | null;
  snow: number | null;
  vertVis: number | null;
  metarType: MetarType;
  rawOb: string;
  lat: number;
  lon: number;
  elev: number;
  name: string;
  clouds: CloudLayer[];
  fltCat: string;
}

/** Response of GET /api/data/metar?format=json */
export type MetarResponse = Metar[];

// ─── TAF ──────────────────────────────────────────────────────────────────────

export type TafChangeType = "TEMPO" | "FM" | "BECMG" | "PROB";

export type IcgTurbVar = "ICE" | "TURB";

export interface IcgTurb {
  var: IcgTurbVar;
  intensity: number;
  minAlt: number;
  maxAlt: number;
}

export type TafTempMaxOrMin = "MAX" | "MIN";

export interface TafTemp {
  validTime: number;
  sfcTemp: number;
  maxOrMin: TafTempMaxOrMin;
}

export interface TafForecast {
  timeFrom: number;
  timeTo: number;
  timeBec: number | null;
  fcstChange: TafChangeType | null;
  probability: number | null;
  wdir: number | "VRB" | null;
  wspd: number | null;
  wgst: number | null;
  wshearHgt: number | null;
  wshearDir: number | null;
  wshearSpd: number | null;
  visib: number | string | null;
  altim: number | null;
  vertVis: number | null;
  wxString: string | null;
  notDecoded: string | null;
  clouds: CloudLayer[];
  icgTurb: IcgTurb[];
  temp: TafTemp[];
}

export interface Taf {
  icaoId: string;
  dbPopTime: string;
  bulletinTime: string;
  issueTime: string;
  validTimeFrom: number;
  validTimeTo: number;
  rawTAF: string;
  mostRecent: 0 | 1;
  remarks: string;
  lat: number;
  lon: number;
  elev: number;
  prior: number;
  name: string;
  fcsts: TafForecast[];
}

/** Response of GET /api/data/taf?format=json */
export type TafResponse = Taf[];