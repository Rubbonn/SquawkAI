<style lang="scss">
	.sidebar {
		padding: 16px;
		width: 25%;
		border-right: 1px solid var(--outline-primary);
		height: 100%;
		background-color: var(--background-primary);

		&__title {
			color: var(--color-secondary);
			margin-bottom: 24px;
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