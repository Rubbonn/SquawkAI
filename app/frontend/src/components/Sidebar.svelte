<!-- Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3 -->

<style lang="scss">
	.sidebar {
		padding: var(--space-3);
		width: 33%;
		border-right: 1px solid var(--border-default);
		height: 100%;
		background-color: var(--bg-sidebar);
		display: flex;
		flex-direction: column;

		&__title {
			color: var(--accent);
			margin-bottom: var(--space-4);
		}
	}
</style>

<div class="sidebar">
	<h1 class="sidebar__title">SquawkAI</h1>
	<VerticalMenu />
	<Chat />
</div>

<script lang="ts">
	import VerticalMenu from "./VerticalMenu.svelte";
	import Chat from "./Chat.svelte";
</script>