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
		<label for="google-aistudio-apikey">Google AI Studio API Key</label>
		<input name="google-aistudio-apikey" id="google-aistudio-apikey" type="text" placeholder="Enter your Google AI Studio API Key" />
	</div>
</div>