<style lang="scss">
	.vertical-menu {
		margin-bottom: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);

		&__item {
			padding: var(--space-2) var(--space-3);
			border-radius: var(--radius-md);
			line-height: 24px;
			text-align: left;
			color: var(--text-secondary);
			border: 1px solid transparent;
			background: transparent;
			width: 100%;
			transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);

			&:hover {
				background-color: var(--bg-elevated);
				border-color: var(--border-default);
				cursor: pointer;
			}

			&.active {
				background-color: var(--accent-strong);
				color: var(--accent-on);
				border-color: var(--accent-strong);
				box-shadow: 0 0 8px rgba(237, 144, 0, 0.4);
			}
		}

		&__item-icon {
			margin-right: var(--space-3);
			display: inline-block;
			width: 20px;
			height: 20px;
			vertical-align: middle;
		}
	}
</style>

<div class="vertical-menu">
	<button type="button" class={["vertical-menu__item", currentPage.page === 'map' && "active"]} onclick={() => currentPage.page = 'map'}><img src="/icons/map-solid__text-secondary.svg" alt="Map Icon" class="vertical-menu__item-icon">Map</button>
	<button type="button" class={["vertical-menu__item", currentPage.page === 'weather' && "active"]} onclick={() => currentPage.page = 'weather'}><img src="/icons/cloud-sun-rain-solid__text-secondary.svg" alt="Chat Icon" class="vertical-menu__item-icon">Weather Data</button>
	<button type="button" class={["vertical-menu__item", currentPage.page === 'documents' && "active"]} onclick={() => currentPage.page = 'documents'}><img src="icons/file-solid__text-secondary.svg" alt="Chat Icon" class="vertical-menu__item-icon">Documents</button>
	<button type="button" class={["vertical-menu__item", currentPage.page === 'settings' && "active"]} onclick={() => currentPage.page = 'settings'}><img src="icons/gear-solid__text-secondary.svg" alt="Chat Icon" class="vertical-menu__item-icon">Settings</button>
</div>

<script lang="ts">
	import { currentPage } from '../state/current-page.svelte.ts';
</script>