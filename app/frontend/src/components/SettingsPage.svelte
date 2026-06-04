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
		<label for="GOOGLE_API_KEY">Google AI Studio API Key</label>
		<input name="GOOGLE_API_KEY" id="GOOGLE_API_KEY" type="text" placeholder="Enter your Google AI Studio API Key" bind:value={settings.GOOGLE_API_KEY} oninput={() => bridge.setSetting('GOOGLE_API_KEY', settings.GOOGLE_API_KEY)}/>
	</div>
</div>

<script lang="ts">
	import { settings } from '../state/settings.svelte.ts';
	import { bridge } from '../services/backend-bridge.ts';
</script>