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