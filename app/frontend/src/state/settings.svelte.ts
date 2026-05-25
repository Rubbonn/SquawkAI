import { bridge } from '../services/backend-bridge.ts';

interface SettingsInterface {
	AistudioApiKey: string;
}

const settings: SettingsInterface = $state({
	AistudioApiKey: await bridge.getSetting('AistudioApiKey') || ''
});

export { settings, type SettingsInterface };