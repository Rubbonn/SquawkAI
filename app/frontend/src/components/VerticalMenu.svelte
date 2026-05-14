<style lang="scss">
	.vertical-menu {
		margin-bottom: 24px;
		display: flex;
		flex-direction: column;
		gap: 8px;

		&__item {
			padding: 8px 16px;
			border-radius: 8px;
			line-height: 24px;

			&:hover {
				background-color: var(--background-secondary);
			}

			&.active {
				background-color: #ED9000;
				color: #FFDCBC;
			}
		}

		&__item-icon {
			margin-right: 16px;
			display: inline-block;
			width: 20px;
			height: 20px;
		}
	}
</style>

<div class="vertical-menu">
	<a href="#" class={["vertical-menu__item", currentPage.page === 'chat' && "active"]} onclick={() => currentPage.page = 'chat'}><img src="src/icons/chat.png" alt="Chat Icon" class="vertical-menu__item-icon">Chat</a>
	<a href="#" class={["vertical-menu__item", currentPage.page === 'weather' && "active"]} onclick={() => currentPage.page = 'weather'}><img src="src/icons/chat.png" alt="Chat Icon" class="vertical-menu__item-icon">Weather Data</a>
	<a href="#" class={["vertical-menu__item", currentPage.page === 'documents' && "active"]} onclick={() => currentPage.page = 'documents'}><img src="src/icons/chat.png" alt="Chat Icon" class="vertical-menu__item-icon">Documents</a>
</div>

<script lang="ts">
	import { currentPage } from '../context/current-page.svelte';
</script>