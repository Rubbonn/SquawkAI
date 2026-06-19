// Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3

import { bridge } from '../services/backend-bridge';

interface SettingsInterface {
	GOOGLE_API_KEY: string;
	GOOGLE_MODEL: string;
}

const settings: SettingsInterface = $state({
	GOOGLE_API_KEY: await bridge.getSetting('GOOGLE_API_KEY') || '',
	GOOGLE_MODEL: await bridge.getSetting('GOOGLE_MODEL') || ''
});

export { settings, type SettingsInterface };