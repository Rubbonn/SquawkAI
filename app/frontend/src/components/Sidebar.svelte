<style lang="scss">
	.sidebar {
		padding: var(--space-3);
		width: 25%;
		border-right: 1px solid var(--border-default);
		height: 100%;
		background-color: var(--bg-sidebar);

		&__title {
			color: var(--accent);
			margin-bottom: var(--space-4);
		}
	}
</style>

<div class="sidebar">
	<h1 class="sidebar__title">SquawkAI</h1>
	<VerticalMenu />
</div>

<script lang="ts">
	import VerticalMenu from "./VerticalMenu.svelte";
</script>