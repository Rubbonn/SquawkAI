from PySide6.QtCore import QObject, Slot

class Bridge(QObject):
    @Slot(str, result=dict)
    def get_airport_weather(self, icao: str) -> dict:
        import httpx
        metar = httpx.get('https://aviationweather.gov/api/data/metar', params={'ids': icao, 'format': 'json'}, headers={'User-Agent': 'SquawkAI/1.0'})
        print(metar.json())
        taf = httpx.get('https://aviationweather.gov/api/data/taf', params={'ids': icao, 'format': 'json'}, headers={'User-Agent': 'SquawkAI/1.0'})
        print(taf.json())