<style lang="scss">
	.airport-weather {
		border-radius: var(--radius-md);
	}
</style>

<div class="airport-weather ui-card">
	<div class="airport-weather__header">
		<h2 class="airport-weather__title">{icao}</h2>
		<p class="airport-weather__subtitle technical">{name}</p>
	</div>
</div>

<script lang="ts">
	import type { Metar, Taf } from "../lib/types";
	let { icao, metar, taf }: { icao: string; metar: Metar | null; taf: Taf | null } = $props();
	const name = metar?.name || taf?.name || "Unknown Airport";
</script>