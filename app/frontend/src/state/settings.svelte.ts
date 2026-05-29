import { bridge } from '../services/backend-bridge';

interface SettingsInterface {
	AistudioApiKey: string;
}

const settings: SettingsInterface = $state({
	AistudioApiKey: await bridge.getSetting('AistudioApiKey') || ''
});

export { settings, type SettingsInterface };