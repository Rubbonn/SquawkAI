<style lang="scss">
	.weather-page {
		&__header {
			margin-bottom: var(--space-3);
		}

		&__title {
			color: var(--text-primary);
			margin-bottom: var(--space-1);
		}

		&__subtitle {
			color: var(--text-secondary);
		}

		&__search {
			display: flex;
			align-items: center;
			gap: var(--space-2);
		}

		&__input-search {
			width: 512px;
		}

		&__search-button {
			font-size: 0.75rem;
			line-height: 1;
			min-height: 40px;
		}
	}
</style>

<div class="weather-page">
	<div class="weather-page__header">
		<h1 class="weather-page__title">Weather & Planning</h1>
		<p class="weather-page__subtitle technical">ZULU: {time.toString({'smallestUnit':'seconds'})} | LCL: {localTime.toString({'smallestUnit':'seconds'})}</p>
	</div>
	<div class="weather-page__search">
		<input type="text" name="icao" placeholder="STATION WEATHER LOOKUP (E.G. KJFK)" class="weather-page__input-search input-field technical" bind:value={icao}>
		<button type="button" class="weather-page__search-button btn-primary" onclick={() => fetchWeather(icao)}>LOOKUP</button>
	</div>
</div>

<script lang="ts">
	import { onDestroy } from "svelte";
	let localTime = $state(Temporal.Now.plainTimeISO());
	let time = $state(Temporal.Now.plainTimeISO('UTC'));
	let timer = setInterval(() => {
		localTime = Temporal.Now.plainTimeISO();
		time = Temporal.Now.plainTimeISO('UTC');
	}, 1000);
	let icao = $state('');

	onDestroy(() => {
		clearInterval(timer);
	});

	const fetchWeather = async (icao: string) => {
		if (!icao) return;
		try {
			let response = await fetch(`https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'User-Agent': 'SquawkAI/1.0 (contact: gujojo@hotmail.it)'
				}
			});
			response = await response.json();
			console.log(response);
		} catch (error) {
			console.error("Error fetching weather data:", error);
		}
	};
</script>