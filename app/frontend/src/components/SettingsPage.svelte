<!-- Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3 -->

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
	<div class="settings-page__item">
		<label for="GOOGLE_MODEL">Google AI Model</label>
		<select name="GOOGLE_MODEL" id="GOOGLE_MODEL" bind:value={settings.GOOGLE_MODEL} onchange={() => bridge.setSetting('GOOGLE_MODEL', settings.GOOGLE_MODEL)}>
			{#await fetchModels() then models}
				{#each models as model}
					{const blacklist = ['tts', 'image', 'nano-banana', 'lyria', 'robotics', 'computer-use', 'antigravity', 'gemma', 'deep-research']}
					{#if model.supportedGenerationMethods?.includes('generateContent') && !blacklist.some(term => model.name.toLowerCase().includes(term))}
						<option value={model.name.split('/').pop()}>{model.displayName}</option>
					{/if}
				{/each}
			{/await}
		</select>
	</div>
</div>

<script lang="ts">
	import { settings } from '../state/settings.svelte.ts';
	import { bridge } from '../services/backend-bridge.ts';
	let models: { name: string; displayName: string; supportedGenerationMethods?: string[] }[] = $state([]);

	const fetchModels = async () => {
		if(!settings.GOOGLE_API_KEY) return [];
		if(models.length > 0) return models; // Return cached models if already fetched

		const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', { headers: { 'x-goog-api-key': settings.GOOGLE_API_KEY } });
		const data = await response.json();
		const blacklist = ['tts', 'image', 'nano-banana', 'lyria', 'robotics', 'computer-use', 'antigravity', 'gemma', 'deep-research'];

		models = data.models.filter((model: any) => model.supportedGenerationMethods?.includes('generateContent') && !blacklist.some((term) => model.name.toLowerCase().includes(term)));
		return models;
	}
</script>