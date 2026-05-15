<style lang="scss">
	:global {
		@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

		:root {
			--color-primary: #BBC6E2;
			--color-secondary: #FFB86B;
			--color-tertiary: #D1E4FF;
			--background-primary: #031D34;
			--background-secondary: #FFB86B;
			--background-tertiary: #001428;
			--outline-primary: #45474D;
		}

		#app {
			width: 1280px;
			height: 1024px;
			color: var(--color-primary);
			font-family: 'Inter', sans-serif;
			font-size: 1rem;
			display: flex;
			flex-direction: row;
		}

		h1, h2, h3, h4, h5, h6 {
			font-family: 'Hanken Grotesk', sans-serif;
			font-weight: bold;
			font-size: 2rem;
			line-height: 40px;
		}

		button, .btn {
			border-radius: 4px;
			padding: 4px 16px;
		}

		.btn-secondary {
			background-color: var(--background-secondary);
			border: none;

			&:hover {
				background-color: #ED9000;
				cursor: pointer;
			}
		}

		.content-wrapper {
			padding: 32px;
			background-color: var(--background-tertiary);
			width: 100%;
			height: 100%;
		}

		.technical {
			font-family: 'JetBrains Mono', monospace;
			line-height: 20px;
			font-size: 0.875rem;
		}
	}
</style>

<Sidebar />

<div class="content-wrapper">
	{#if currentPage.page === 'chat'}
		<div>Chat Page</div>
	{:else if currentPage.page === 'weather'}
		<WeatherPage />
	{:else if currentPage.page === 'documents'}
		<div>Documents Page</div>
	{/if}
</div>

<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import WeatherPage from './WeatherPage.svelte';
	import { currentPage } from '../app-context.svelte.ts';
</script>