<style lang="scss">
	.map-page {
		width: 100%;
		height: 100%;
	}

	.map-container {
		width: 100%;
		height: 100%;
	}
</style>

<div class="map-page">
	<div class="map-container" bind:this={mapContainer}></div>
</div>

<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { onMount } from 'svelte';
	import { mapState } from '../state/map-elements.svelte.ts';

	let mapContainer: HTMLDivElement;
	let map: maplibregl.Map;
	const addedMarkers: maplibregl.Marker[] = [];

	onMount(() => {
		map = new maplibregl.Map({
			container: mapContainer, // container id
			style: {
				version: 8,
				zoom: 7,
				sources: {
					openflightmapsBase: {
						type: 'raster',
						tiles: ['https://nwy-tiles-api.prod.newaydata.com/tiles/{z}/{x}/{y}.jpg?path=latest/base/latest'],
						tileSize: 512,
						minzoom: 7,
						maxzoom: 12,
						attribution: ["(c) open flightmaps association", "(c) openstreetmap contributors", "NASA elevation data"].join(', ')
					},
					openflightmapsAero: {
						type: 'raster',
						tiles: ['https://nwy-tiles-api.prod.newaydata.com/tiles/{z}/{x}/{y}.png?path=latest/aero/latest'],
						tileSize: 512,
						minzoom: 7,
						maxzoom: 12,
						attribution: ["(c) open flightmaps association", "(c) openstreetmap contributors", "NASA elevation data"].join(', ')
					},
				},
				layers: [
					{
						id: 'openflightmaps-base-layer',
						type: 'raster',
						source: 'openflightmapsBase',
					},
					{
						id: 'openflightmaps-aero-layer',
						type: 'raster',
						source: 'openflightmapsAero',
					},
				],
			},
			minZoom: 7,
			maxZoom: 12,
			maxPitch: 0,
			center: [12.4964, 41.9028],
		}).addControl(new maplibregl.NavigationControl(), 'top-right');
		return () => {
			map.remove();
		}
	});

	$effect(() => {
		for(const marker of addedMarkers) {
			marker.remove();
		}

		for(const marker of mapState.points) {
			const popup = new maplibregl.Popup({ offset: 25 });
			if(marker.name)
				popup.setText(marker.name);

			addedMarkers.push(new maplibregl.Marker()
				.setLngLat([marker.lng, marker.lat])
				.setPopup(popup).addTo(map));
		}
	});
</script>