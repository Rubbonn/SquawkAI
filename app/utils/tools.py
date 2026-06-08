from app.utils.documents import document_index
from base64 import standard_b64encode
from langchain.messages import ToolMessage, TextContentBlock, FileContentBlock
from langchain.tools import ToolRuntime

def get_airport_weather(icao: str) -> dict:
	'''Fetches METAR and TAF weather data for a given airport ICAO code from aviationweather.gov.
	Args:
		icao (str): The ICAO code of the airport to fetch weather data for.
		
	Returns:
		dict: A dictionary containing 'metar' and 'taf' keys with the respective weather data, or an 'error' key if an error occurred.
	'''
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
	'''Returns a list of available documents in the document index.
	
	Returns:
		list[Document]: A list of Document objects representing the indexed documents.
	'''
	return document_index.documents

def get_document(name: str, runtime: ToolRuntime) -> ToolMessage | None:
	'''Retrieves a document content and metadata by its name from the document index.

	Args:
		name (str): The file name of the document to retrieve.
		
	Returns:
		ToolMessage | None: A ToolMessage containing the document's content and metadata, or None if the document is not found.
	'''
	doc = document_index.get_document(name)
	if not doc:
		return None
	
	with open(doc.path, 'rb') as f:
		doc_content = f.read()
	
	return ToolMessage(content_blocks=[
		TextContentBlock(type='text', text=doc.model_dump_json()),
		FileContentBlock(type='file', base64=standard_b64encode(doc_content).decode(), mime_type='application/pdf')
	], tool_call_id=runtime.tool_call_id)