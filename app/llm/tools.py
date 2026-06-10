from app.state.map import MapState, map_state
from app.utils.documents import document_index
from base64 import standard_b64encode
from langchain.messages import ToolMessage, TextContentBlock, FileContentBlock
from langchain.tools import ToolRuntime

def get_airport_weather(icao: str) -> dict:
	"""Fetches METAR and TAF weather data for a given airport ICAO code from aviationweather.gov.
	Args:
		icao (str): The ICAO code of the airport to fetch weather data for.
		
	Returns:
		dict: A dictionary containing 'metar' and 'taf' keys with the respective weather data, or an 'error' key if an error occurred.
	"""
	import httpx
	try:
		response = httpx.get('https://aviationweather.gov/api/data/metar', params={'ids': icao, 'format': 'json'}, headers={'User-Agent': 'SquawkAI/1.0'})
		response.raise_for_status()
		metar = response.json() if response.status_code == httpx.codes.OK else None
		response = httpx.get('https://aviationweather.gov/api/data/taf', params={'ids': icao, 'format': 'json'}, headers={'User-Agent': 'SquawkAI/1.0'})
		response.raise_for_status()
		taf = response.json() if response.status_code == httpx.codes.OK else None
	except httpx.HTTPError as e:
		return {'error': f'HTTP error occurred: {e}'}
	
	return {
		'metar': metar[0] if metar and len(metar) > 0 else None,
		'taf': taf[0] if taf and len(taf) > 0 else None
	}

def get_available_documents() -> list[dict]:
	"""Returns a list of available documents in the document index.
	
	Returns:
		list[Document]: A list of Document objects representing the indexed documents.
	"""
	return document_index.documents

def get_document(name: str, runtime: ToolRuntime) -> ToolMessage | None:
	"""Retrieves a document content and metadata by its name from the document index.

	Args:
		name (str): The file name of the document to retrieve.
		
	Returns:
		ToolMessage | None: A ToolMessage containing the document's content and metadata, or None if the document is not found.
	"""
	doc = document_index.get_document(name)
	if not doc:
		return None
	
	with open(doc.path, 'rb') as f:
		doc_content = f.read()
	
	return ToolMessage(content_blocks=[
		TextContentBlock(type='text', text=doc.model_dump_json()),
		FileContentBlock(type='file', base64=standard_b64encode(doc_content).decode(), mime_type='application/pdf')
	], tool_call_id=runtime.tool_call_id)

def set_map_state(state: MapState, update: bool = True) -> None:
	"""Update the map state with new points and lines. If update is True, the new state will be merged with the existing state, adding only missing elements (also within individual line points). If update is False, the existing state will be replaced entirely by the new state.

	Args:
		state (MapState): A dict consisting of a point array and a lines array representing the new state of the map. Points add markers to the map, while lines add connected markers. Lines with the same name will be merged together if update is True.
		update (bool): If True, the new state will be merged with the existing state, adding only missing elements. If False, the existing state will be replaced entirely by the new state.
	"""
	from app.utils.bridge import bridge
	global map_state
	if not update:
		map_state = state
		bridge.map_state_updated.emit(map_state)
		return

	# Merge points: add only points not already present
	existing_points = {(p['lat'], p['lng'], p['name']) for p in map_state['points']}
	for point in state['points']:
		key = (point['lat'], point['lng'], point['name'])
		if key not in existing_points:
			map_state['points'].append(point)
			existing_points.add(key)

	# Merge lines: if a line with the same name exists, merge its points;
	# otherwise add the entire line
	existing_lines = {line['name']: line for line in map_state['lines']}
	for new_line in state['lines']:
		line_name = new_line['name']
		if line_name is not None and line_name in existing_lines:
			# Merge points within the existing line
			existing_line = existing_lines[line_name]
			existing_line_points = {(p['lat'], p['lng'], p['name']) for p in existing_line['points']}
			for point in new_line['points']:
				key = (point['lat'], point['lng'], point['name'])
				if key not in existing_line_points:
					existing_line['points'].append(point)
					existing_line_points.add(key)
		else:
			map_state['lines'].append(new_line)
			if line_name is not None:
				existing_lines[line_name] = new_line

	bridge.map_state_updated.emit(map_state)

def get_map_state() -> MapState:
	"""Returns the current state of the map, including all points and lines.

	Returns:
		MapState: A dict containing the current points and lines on the map.
	"""
	return map_state