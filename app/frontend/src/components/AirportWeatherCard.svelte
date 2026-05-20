<style lang="scss">
	.airport-weather {
		border-radius: var(--radius-md);

		&__header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: var(--space-2);
			margin-bottom: var(--space-3);
			border-bottom: 1px solid var(--border-default);
		}

		&__title {
			vertical-align: middle;
			margin-right: var(--space-3);
		}

		&__subtitle {
			vertical-align: middle;
			margin-right: var(--space-4);
		}

		&__category {
			vertical-align: middle;
			border-radius: var(--radius-sm);
			padding: 2px var(--space-2);
			background-color: var(--bg-elevated);
			border: 1px solid #22C55E80;
			color: #4ADE80;
		}

		&__metar {
			margin-bottom: var(--space-2);
		}

		&__metar-title, &__taf-title {
			letter-spacing: 1.2px;
			margin-bottom: var(--space-1);
		}

		&__taf {
			margin-bottom: var(--space-3);
		}
	}
</style>

<div class="airport-weather ui-card">
	<div class="airport-weather__header">
		<div><span class="airport-weather__title h2">{icao}</span> <span class="airport-weather__subtitle technical">{name}</span> <span class="airport-weather__category text-small technical">{metar?.fltCat}</span></div>
		<span class="airport-weather__observation-time technical">Updated: {`${obsTime.getUTCHours().toString().padStart(2, '0')}:${obsTime.getUTCMinutes().toString().padStart(2, '0')}z`}</span>
	</div>
	{#if metar}
	<div class="airport-weather__metar">
		<p class="airport-weather__metar-title text-small"><b>Current (METAR)</b></p>
		<div class="airport-weather__metar-code ui-code technical text-center">{metar?.rawOb}</div>
	</div>
	{/if}
	{#if taf}
	<div class="airport-weather__taf">
		<p class="airport-weather__taf-title text-small"><b>Forecast (TAF)</b></p>
		<div class="airport-weather__taf-code ui-code technical text-center">{taf?.rawTAF}</div>
	</div>
	{/if}
</div>

<script lang="ts">
	import type { Metar, Taf } from "../lib/types";
	let { icao, metar, taf }: { icao: string; metar: Metar | null; taf: Taf | null } = $props();
	const name = $derived(metar?.name || taf?.name || "Unknown Airport");
	const obsTime = $derived(metar ? new Date(metar.obsTime) : null);
</script>