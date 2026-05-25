<style lang="scss">
	.settings-page {
		&__item {
			margin-top: var(--space-3);

			label {
				display: block;
				margin-bottom: var(--space-1);
			}
		}
	}
</style>

<div class="settings-page">
	<h2>Settings</h2>
	<p class="text-small technical">Here you can configure your preferences and settings for the SquawkAI application.</p>

	<div class="settings-page__item">
		<label for="aistudio-apikey">Google AI Studio API Key</label>
		<input name="AistudioApiKey" id="aistudio-apikey" type="text" placeholder="Enter your Google AI Studio API Key" bind:value={settings.AistudioApiKey} oninput={() => bridge.setSetting('AistudioApiKey', settings.AistudioApiKey)}/>
	</div>
</div>

<script lang="ts">
	import { settings } from '../state/settings.svelte.ts';
	import { bridge } from '../services/backend-bridge.ts';
</script>