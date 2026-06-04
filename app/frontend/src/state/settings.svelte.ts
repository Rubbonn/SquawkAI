import { bridge } from '../services/backend-bridge';

interface SettingsInterface {
	GOOGLE_API_KEY: string;
}

const settings: SettingsInterface = $state({
	GOOGLE_API_KEY: await bridge.getSetting('GOOGLE_API_KEY') || ''
});

export { settings, type SettingsInterface };