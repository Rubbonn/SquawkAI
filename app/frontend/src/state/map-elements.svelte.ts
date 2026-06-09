import { bridge } from '../services/backend-bridge.ts';
import maplibregl from 'maplibre-gl';

const markers: maplibregl.Marker[] = $state([]);
const polylines: { lat: number, lng: number }[][] = $state([]);

bridge.newMapMarker((latitude, longitude, name = '') => {
	const popup = new maplibregl.Popup({ offset: 25 });
	if(name)
		popup.setText(name);

	markers.push(new maplibregl.Marker()
		.setLngLat([longitude, latitude])
		.setPopup(popup));
});

export { markers, polylines };