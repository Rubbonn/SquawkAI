<style lang="scss">
	@use 'sass:map';
	
	:global {
		@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

		$heading-scale: (
            h1: (size: 2rem, line-height: 1.25),
            h2: (size: 2rem, line-height: 1.25),
            h3: (size: 1.875rem, line-height: 1.3),
            h4: (size: 1.75rem, line-height: 1.3),
            h5: (size: 1.625rem, line-height: 1.35),
            h6: (size: 1.5rem, line-height: 1.4)
        );

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
			--status-error-on: #FF513E;

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

			--app-width: 1280px;
			--app-height: 1024px;
		}

		* {
			scrollbar-gutter: stable;
			&::-webkit-scrollbar {
				width: var(--space-2);
				height: var(--space-2);
			}

			&::-webkit-scrollbar-track {
				border-radius: 9999px;
				background-color: var(--bg-surface);
				border: 1px solid var(--border-default);
				margin: var(--space-1) 0;
			}

			&::-webkit-scrollbar-thumb {
				border-radius: 9999px;
				background-color: var(--text-muted);
				background-clip: content-box;
				border: 3px solid transparent;
			}
		}

		#app {
			width: var(--app-width);
			height: var(--app-height);
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
		}

		@each $name, $values in $heading-scale {
            #{$name},
            .#{$name} {
                font-size: map.get($values, size);
                line-height: map.get($values, line-height);
            }
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

				&:disabled {
					cursor: not-allowed;
				}
			}

			&:disabled {
				cursor: not-allowed;
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

		.btn-danger {
			background-color: var(--status-error);
			color: var(--accent-on);
			border-color: var(--accent-on);

			&:hover {
				background-color: var(--status-error-on);
				border-color: var(--status-error-on);
				cursor: pointer;
			}

			&:focus-visible {
				outline: none;
				box-shadow: 0 0 0 2px var(--focus-ring);
			}
		}

		.btn-invisible {
			border-radius: initial;
			padding: 0;
			border: none;

			&:hover {
				background-color: initial;
				border: none;
				text-decoration: underline;
			}
		}

		input[type='text'],
		input[type='search'],
		input[type='email'],
		input[type='password'],
		input[type='url'],
		input[type='tel'],
		textarea,
		select,
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

			&:disabled {
				cursor: not-allowed;
			}
		}

		select {
			appearance: none;
			-webkit-appearance: none;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23FFB86B' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
			background-repeat: no-repeat;
			background-position: right var(--space-3) center;
			padding-right: calc(var(--space-3) * 2 + 12px);
			cursor: pointer;

			option {
				background-color: var(--bg-elevated);
				color: var(--text-secondary);
			}

			&:hover {
				border-color: var(--border-strong);
			}
		}

		hr {
			border: none;
			border-top: 1px solid var(--border-default);
			margin: var(--space-2) 0;
			width: 100%;
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

		.text-danger {
			color: var(--status-error);
		}

		.w-100 {
			width: 100%;
		}

		.h-100 {
			height: 100%;
		}

		.d-none {
			display: none !important;
		}

		.d-block {
			display: block !important;
		}

		.d-inline-block {
			display: inline-block !important;
		}

		@keyframes spin {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		.spin {
			animation: spin 1.5s linear infinite;
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