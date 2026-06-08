<style lang="scss">
	.collapsible-card {
		padding: var(--space-2);

		&:not(:last-child) {
			margin-bottom: var(--space-2);
		}

		&__header {
			display: flex;
			justify-content: space-between;
		}

		&__toggle {
			cursor: pointer;
			rotate: 0;
			transition: rotate 300ms ease-in-out;

			&.collapsed {
				rotate: -90deg;
			}
		}

		&__body {
			opacity: 1;
			max-height: 1000px;
			transition: max-height 300ms ease-in-out, opacity 300ms ease-in-out;
			margin-top: var(--space-2);

			&.collapsed {
				opacity: 0;
				max-height: 0;
				overflow: hidden;
				margin: 0;
			}
		}
	}
</style>

<div class="collapsible-card ui-card">
	<div class="collapsible-card__header" role="button" aria-expanded={!collapsed} tabindex="0" onclick={() => collapsed = !collapsed} onkeyup={(e) => { if (e.key === 'Enter' || e.key === ' ') { collapsed = !collapsed; } }}>
		{#if header}
			{@render header()}
		{/if}
		<img class="collapsible-card__toggle {collapsed ? 'collapsed' : ''}" src="/icons/angle-down-solid__text-primary.svg" alt="Toggle" width="32" height="32" />
	</div>
	<div class="collapsible-card__body collapse {collapsed ? 'collapsed' : ''}">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<script lang="ts">
	import { type Snippet } from 'svelte';
	const { header, children }: { header: Snippet; children: Snippet} = $props();
	let collapsed = $state(false);
</script>