// Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3

import { bridge } from '../services/backend-bridge.ts';
import { type MapState } from '../lib/types';

const mapState: MapState = $state({ points: [], lines: [] });

bridge.mapStateUpdated((state: MapState) => {
	mapState.points = state.points;
	mapState.lines = state.lines;
});

export { mapState };