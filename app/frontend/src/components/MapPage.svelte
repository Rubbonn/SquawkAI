<!-- Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3 -->

<style lang="scss">
	.map-page {
		width: 100%;
		height: 100%;
	}

	.map-container {
		width: 100%;
		height: 100%;

		:global(.maplibregl-popup-content) {
			background-color: var(--bg-elevated);
			color: var(--text-primary);
			border: 1px solid var(--border-default);
			border-radius: var(--radius-md);
			padding: var(--space-2) var(--space-4) var(--space-2) var(--space-3);
			font-family: 'Inter', sans-serif;
			font-size: 0.875rem;
			font-weight: 500;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
		}

		:global(.maplibregl-popup-tip) {
			border-top-color: var(--bg-elevated) !important;
		}

		:global(.maplibregl-popup-close-button) {
			color: var(--text-muted);
			font-size: 1.125rem;
			padding: var(--space-1);
			border-radius: var(--radius-sm);

			&:hover {
				color: var(--text-primary);
				background-color: transparent;
			}
		}
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
	const addedSources: string[] = [];
	const addedLayers: string[] = [];

	const accentStrongColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-strong').trim() || '#ED9000';

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

	$effect(() => {
		if(mapState.points.length === 0 && mapState.lines.length === 0)
			return;

		const resetMap = () => {
			for(const marker of addedMarkers)
				marker.remove();

			for(const layer of addedLayers)
				map.removeLayer(layer);

			for(const source of addedSources)
				map.removeSource(source);

			addedMarkers.length = 0;
			addedSources.length = 0;
			addedLayers.length = 0;
		}

		const updateMap = () => {
			resetMap();
			for(const marker of mapState.points) {
				const popup = new maplibregl.Popup({ offset: 25 });
				if(marker.name)
					popup.setText(marker.name);

				addedMarkers.push(new maplibregl.Marker({ color: accentStrongColor })
					.setLngLat([marker.lng, marker.lat])
					.setPopup(popup).addTo(map));
			}

			let lineIndex = 0;
			for(const line of mapState.lines) {
				for(const marker of line.points) {
					const popup = new maplibregl.Popup({ offset: 25 });
					if(marker.name)
						popup.setText(marker.name);

					addedMarkers.push(new maplibregl.Marker({ color: accentStrongColor })
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
						'line-color': accentStrongColor,
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
						'symbol-placement': 'line',
					},
					paint: {
						'text-color': '#ffffff',
						'text-halo-color': accentStrongColor,
						'text-halo-width': 2,
						'text-halo-blur': 1,
					}
				});
				addedSources.push(lineName);
				addedLayers.push(lineName);
				addedLayers.push(`${lineName}-label`);
			}
		}
		
		if(map && map.isStyleLoaded()) {
			updateMap();
		} else {
			map.once('style.load', updateMap);
		}
	});
</script>