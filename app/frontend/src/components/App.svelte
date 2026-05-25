<style lang="scss">
	:global {
		@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

		:root {
			/* Simplified cockpit theme tokens */
			--bg-app: #001428;
			--bg-sidebar: #031D34;
			--bg-surface: #072138;
			--bg-elevated: #1B263B;

			--text-primary: #D1E4FF;
			--text-secondary: #C5C6CD;
			--text-muted: #828DA7;

			--accent: #FFB86B;
			--accent-strong: #ED9000;
			--accent-on: #2C1700;

			--border-default: #45474D;
			--border-strong: #8F9097;
			--focus-ring: rgba(255, 184, 107, 0.45);

			--status-error: #FFB4AB;

			--space-1: 4px;
			--space-2: 8px;
			--space-3: 16px;
			--space-4: 24px;
			--space-5: 32px;

			--radius-sm: 4px;
			--radius-md: 8px;
			--radius-lg: 16px;

			--transition-fast: 120ms ease;
			--transition-normal: 180ms ease;
		}

		#app {
			width: 1280px;
			height: 1024px;
			color: var(--text-primary);
			font-family: 'Inter', sans-serif;
			font-size: 1rem;
			display: flex;
			flex-direction: row;
			background-color: var(--bg-app);
		}

		h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
			font-family: 'Hanken Grotesk', sans-serif;
			font-weight: bold;
			font-size: 2rem;
			line-height: 40px;
		}

		button, .btn {
			border-radius: var(--radius-md);
			padding: var(--space-2) var(--space-3);
			border: 1px solid transparent;
			font-family: 'Inter', sans-serif;
			font-weight: 600;
			transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
			background-color: transparent;
			color: var(--text-primary);
			border-color: transparent;

			&:hover {
				background-color: var(--bg-elevated);
				border-color: var(--border-default);
				cursor: pointer;
			}
		}

		.btn-primary {
			background-color: var(--accent);
			color: var(--accent-on);
			border-color: var(--accent);

			&:hover {
				background-color: var(--accent-strong);
				border-color: var(--accent-strong);
				cursor: pointer;
			}

			&:focus-visible {
				outline: none;
				box-shadow: 0 0 0 2px var(--focus-ring);
			}
		}

		.btn-secondary {
			background-color: transparent;
			color: var(--accent);
			border-color: var(--accent);

			&:hover {
				background-color: rgba(255, 184, 107, 0.12);
				border-color: var(--accent);
				cursor: pointer;
			}

			&:focus-visible {
				outline: none;
				box-shadow: 0 0 0 2px var(--focus-ring);
			}
		}

		input[type='text'],
		input[type='search'],
		input[type='email'],
		input[type='password'],
		input[type='url'],
		input[type='tel'],
		textarea,
		.input-field {
			padding: var(--space-2) var(--space-3);
			border-radius: var(--radius-md);
			border: 1px solid var(--border-default);
			background-color: var(--bg-elevated);
			color: var(--text-secondary);
			transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

			&::placeholder {
				color: var(--text-muted);
			}

			&:focus-visible {
				outline: none;
				border-color: var(--accent);
				box-shadow: 0 0 0 2px var(--focus-ring);
			}
		}

		.ui-card {
			background-color: var(--bg-surface);
			border: 1px solid var(--border-default);
			border-radius: var(--radius-lg);
			padding: var(--space-3);

			.ui-card {
				background-color: var(--bg-sidebar);
				border: 1px solid var(--border-default);
				border-radius: var(--radius-sm);
			}
		}

		.ui-highlight {
			background-color: rgba(255, 184, 107, 0.14);
			border-left: 3px solid var(--accent);
			border-radius: var(--radius-sm);
			padding: var(--space-2) var(--space-3);
		}

		.ui-code {
			background-color: #000F20;
			border: 1px solid var(--border-default);
			border-radius: var(--radius-sm);
			padding: var(--space-2);
		}

		.content-wrapper {
			padding: var(--space-5);
			background-color: var(--bg-app);
			width: 100%;
			height: 100%;
		}

		.technical {
			font-family: 'JetBrains Mono', monospace;
			line-height: 20px;
			font-size: 0.875rem;
			letter-spacing: 0.05em;
		}

		.text-small {
			font-size: 0.75rem;
			line-height: 16px;
		}

		.text-center {
			text-align: center;
		}

		.w-100 {
			width: 100%;
		}

		.h-100 {
			height: 100%;
		}
	}
</style>

<Sidebar />

<div class="content-wrapper">
	{#if currentPage.page === 'map'}
		<MapPage />
	{:else if currentPage.page === 'weather'}
		<WeatherPage />
	{:else if currentPage.page === 'documents'}
		<DocumentsPage />
	{:else if currentPage.page === 'settings'}
		<SettingsPage />
	{/if}
</div>

<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import MapPage from './MapPage.svelte';
	import WeatherPage from './WeatherPage.svelte';
	import DocumentsPage from './DocumentsPage.svelte';
	import SettingsPage from './SettingsPage.svelte';
	import { currentPage } from '../state/current-page.svelte.ts';
</script>