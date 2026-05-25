from PySide6.QtCore import QObject, Slot, QSettings

class Bridge(QObject):
    @Slot(str, result=dict)
    def get_airport_weather(self, icao: str) -> dict:
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
            'metar': metar,
            'taf': taf
        }
    
    @Slot(str, result=str)
    def get_setting(self, key: str) -> str:
        settings = QSettings()
        return str(settings.value(key, defaultValue='', type=str))
    
    @Slot(str, str, result=None)
    def set_setting(self, key: str, value: str) -> None:
        settings = QSettings()
        settings.setValue(key, value)