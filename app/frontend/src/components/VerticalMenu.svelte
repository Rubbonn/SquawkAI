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
	<button type="button" class={["vertical-menu__item", currentPage.page === 'chat' && "active"]} onclick={() => currentPage.page = 'chat'}><img src="src/icons/chat.png" alt="Chat Icon" class="vertical-menu__item-icon">Chat</button>
	<button type="button" class={["vertical-menu__item", currentPage.page === 'weather' && "active"]} onclick={() => currentPage.page = 'weather'}><img src="src/icons/chat.png" alt="Chat Icon" class="vertical-menu__item-icon">Weather Data</button>
	<button type="button" class={["vertical-menu__item", currentPage.page === 'documents' && "active"]} onclick={() => currentPage.page = 'documents'}><img src="src/icons/chat.png" alt="Chat Icon" class="vertical-menu__item-icon">Documents</button>
</div>

<script lang="ts">
	import { currentPage } from '../app-context.svelte.ts';
</script>