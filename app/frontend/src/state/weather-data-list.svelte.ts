// Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3

import type { Metar, Taf } from "../lib/types";

const weatherDataList: Record<string, { metar: Metar | null; taf: Taf | null }> = $state({});

export { weatherDataList };