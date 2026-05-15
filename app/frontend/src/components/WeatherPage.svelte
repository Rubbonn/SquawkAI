<style lang="scss">
    .weather-page {
        &__header {
            margin-bottom: 16px;
        }

        &__title {
            color: var(--color-tertiary);
            margin-bottom: 4px;
        }

        &__input-search {
            padding: 8px;
            border-radius: 8px;
            border: 1px solid var(--outline-primary);
            background-color: #1B263B;
            color: #C5C6CD;
            width: 512px;
        }

        &__search-button {
            font-size: 0.75rem;
        }
    }
</style>

<div class="weather-page">
    <div class="weather-page__header">
        <h1 class="weather-page__title">Weather & Planning</h1>
        <p class="weather-page__subtitle technical">ZULU: {time.toString({'smallestUnit':'seconds'})} | LCL: {localTime.toString({'smallestUnit':'seconds'})}</p>
    </div>
    <div class="weather-page__search">
        <input type="text" name="icao" placeholder="STATION WEATHER LOOKUP (E.G. KJFK)" class="weather-page__input-search technical">
        <button type="button" class="weather-page__search-button btn-secondary">LOOKUP</button>
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

    onDestroy(() => {
        clearInterval(timer);
    });
</script>