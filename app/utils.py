from PySide6.QtCore import QObject, Slot

class Bridge(QObject):
    @Slot(str, result=dict)
    def get_airport_weather(self, icao: str) -> dict:
        import httpx
        try:
            response = httpx.get('https://aviationweather.gov/api/data/metar', params={'ids': icao, 'format': 'json'}, headers={'User-Agent': 'SquawkAI/1.0'})
            response.raise_for_status()
            metar = response.json()
            response = httpx.get('https://aviationweather.gov/api/data/taf', params={'ids': icao, 'format': 'json'}, headers={'User-Agent': 'SquawkAI/1.0'})
            response.raise_for_status()
            taf = response.json()
        except httpx.HTTPError as e:
            raise RuntimeError(f'Errore durante il recupero dei dati meteo: {e}')
        
        print(metar[0], taf[0])
        return {
            'metar': metar,
            'taf': taf
        }