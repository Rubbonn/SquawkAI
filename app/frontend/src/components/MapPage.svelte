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
	<button onclick={() => {mapState.points.push({ lat: 45.46111, lng: 9.159444, name: 'Test Point' })}}>Add Test Point</button>
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
			center: [9.159444, 45.46111],
		}).addControl(new maplibregl.NavigationControl(), 'top-right');
		return () => {
			map.remove();
		}
	});

	const updateMap = async () => {
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

		let lineIndex = 0;
		for(const line of mapState.lines) {
			for(const marker of line.points) {
				const popup = new maplibregl.Popup({ offset: 25 });
				if(marker.name)
					popup.setText(marker.name);

				addedMarkers.push(new maplibregl.Marker()
					.setLngLat([marker.lng, marker.lat])
					.setPopup(popup).addTo(map));
			}
			const coordinates = line.points.map(point => [point.lng, point.lat]);
			let lineName = line.name || `line-${lineIndex++}`;
			map.addSource(lineName, {
				type: 'geojson',
				data: {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates,
					},
				},
			}).addLayer({
				id: lineName,
				type: 'line',
				source: lineName,
				layout: {
					'line-join': 'miter',
					'line-cap': 'round',
				},
				paint: {
					'line-color': '#333',
					'line-width': 4,
				}
			}).addLayer({
				id: `${lineName}-label`,
				type: 'symbol',
				source: lineName,
				layout: {
					'text-field': line.name || '',
					'text-size': ['interpolate', ['linear'], ['zoom'], 7, 12, 12, 16],
					'text-anchor': 'top',
					'text-max-angle': 90,
					'text-ignore-placement': true,
					'text-allow-overlap': true,
					'symbol-placement': 'line',
				},
				paint: {
					'text-color': '#000',
					'text-halo-color': '#fff',
					'text-halo-width': 1,
					'text-halo-blur': 1,
				}
			});
		}
	}

	$effect(() => {
		mapState; // subscribe to changes
		console.log(mapState);
		if(map && map.isStyleLoaded()) {
			updateMap();
		} else {
			map.once('style.load', updateMap);
		}
	});
</script>