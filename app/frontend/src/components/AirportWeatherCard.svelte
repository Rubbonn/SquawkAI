<style lang="scss">
	.airport-weather {
		border-radius: var(--radius-md);
		margin-bottom: var(--space-2);

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

			&.VFR {
				border: 1px solid #22C55E;
				color: #4ADE80;
			}

			&.MVFR {
				border: 1px solid var(--accent);
				color: var(--accent);
			}

			&.IFR {
				border: 1px solid #F87171;
				color: #F87171;
			}
		}

		&__metar {
			margin-bottom: var(--space-2);

			&:last-child {
				margin-bottom: var(--space-3);
			}
		}

		&__metar-title, &__taf-title {
			letter-spacing: 1.2px;
			margin-bottom: var(--space-1);
		}

		&__taf {
			margin-bottom: var(--space-3);
		}

		&__summary {
			display: flex;
			gap: var(--space-2);
			flex-direction: row;
			justify-content: space-between;

			& > * {
				flex: 1;
			}
		}

		&__wind, &__visibility, &__clouds {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--space-2);
		}

		&__wind-graph {
			position: relative;
			width: 64px;
			height: 64px;
			border-radius: 50%;
			border: 1px solid var(--border-default);
			display: flex;
			align-items: center;
			justify-content: center;

			&::before {
				content: "";
				position: absolute;
				left: 7%;
				top: 50%;
				background-image: url("/icons/arrow.png");
				display: block;
				transform: translate(-50%, -50%) rotate(calc(var(--wind-dir, 0deg) + 90deg));
				transform-origin: calc(50% + 27px) 50%;
				width: 16px;
				height: 16px;
			}
		}
	}
</style>

<div class="airport-weather ui-card">
	<div class="airport-weather__header">
		<div><span class="airport-weather__title h2">{icao}</span> <span class="airport-weather__subtitle technical">{name}</span> <span class="airport-weather__category text-small technical {metar?.fltCat}">{metar?.fltCat}</span></div>
		<div>
			<span class="airport-weather__observation-time technical">Updated: {obsTimeText}</span>
			<button onclick={() => onrefresh && onrefresh(icao)} class="btn-secondary text-small"><img src="/icons/rotate-solid__accent.svg" alt="Refresh" width="16" height="16"></button>
			<button onclick={() => onclose && onclose(icao)} class="btn-ghost text-small"><img src="/icons/x-solid__text-primary.svg" alt="Close" width="16" height="16"></button>
		</div>
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
	{#if metar}
	<div class="airport-weather__summary">
		<div class="airport-weather__wind ui-card">
			<span class="text-small">WIND {#if metar?.wgst}(GUST){/if}</span>
			<div class="airport-weather__wind-graph" style:--wind-dir={metar?.wdir !== 'VRB' ? `${metar?.wdir}deg` : '0deg'}>
				<span>{metar?.wdir}°</span>
			</div>
			<span class="text-small">{metar?.wspd}{#if metar?.wgst}G{metar?.wgst}{/if} KT</span>
		</div>
		<div class="airport-weather__visibility ui-card">
			<span class="text-small">VIS & WX</span>
			<p>{metar?.visib} SM</p>
			<p>QNH {metar?.altim} hPA</p>
			<p>Temp {metar?.temp}°C/{metar?.dewp}°C</p>
			<p>{metar?.wxString}</p>
		</div>
		<div class="airport-weather__clouds ui-card">
			<span class="text-small">CLOUDS</span>
			{#if metar?.clouds.length > 0}
				{#each metar.clouds as cloud}
					<p>{cloud.cover} {cloud.base ? `at ${cloud.base} ft` : ""}</p>
				{/each}
			{:else}
				<p>CLR</p>
			{/if}
		</div>
	</div>
	{/if}
</div>

<script lang="ts">
	import type { Metar, Taf } from "../lib/types";
	let { icao, metar, taf, onclose, onrefresh }: { icao: string; metar: Metar | null; taf: Taf | null; onclose?: (icao: string) => void; onrefresh?: (icao: string) => void } = $props();
	const name = $derived(metar?.name || taf?.name || "Unknown Airport");
	const obsTime = $derived(metar ? new Date(metar.obsTime * 1000) : null);
	const obsTimeText = $derived(obsTime ? `${obsTime.getUTCHours().toString().padStart(2, '0')}:${obsTime.getUTCMinutes().toString().padStart(2, '0')}z` : "N/A");
</script>