import argparse

from app.utils import Bridge
import sys
b = Bridge()
b.get_airport_weather('LIRF')
sys.exit(0)

def is_desktop_available() -> bool:
	import os
	if os.name == 'nt':  # Windows
		return True
	
	return bool(os.environ.get('DISPLAY') or os.environ.get('WAYLAND_DISPLAY'))

def start_application() -> None:
	from PySide6.QtWidgets import QApplication
	from PySide6.QtWebEngineWidgets import QWebEngineView
	app = QApplication([])

	browser = QWebEngineView()
	browser.setUrl(f'http://localhost:{args.port}')
	browser.resize(1280, 1024)
	browser.show()

	app.exec()

def start_web_server(port: int) -> None:
	from fastapi import FastAPI
	from fastapi.staticfiles import StaticFiles
	from pathlib import Path
	import uvicorn

	app = FastAPI()

	@app.get('/ajax/airport-weather')
	async def get_airport_weather(icao: str):
		# Simulazione di dati meteo per l'aeroporto richiesto
		return {
			'icao': icao,
			'temperature': '15°C',
			'wind': '5 kt NW',
			'visibility': '10 km',
			'conditions': 'Clear'
		}
	
	dist_dir = Path('app/frontend/dist').resolve()
	app.mount('/', StaticFiles(directory=dist_dir, html=True), name='frontend')
	
	uvicorn.run(app, host='0.0.0.0', port=port)

if __name__ == "__main__":
	argument_parser = argparse.ArgumentParser(prog='SquawkAI', description='SquawkAI è un chatbot locale progettato per rispondere a domande aeronautiche consultando le pubblicazioni AIP disponibili sul computer dell’utente.')
	argument_parser.add_argument('--no-gui', action='store_true', help='Esegui SquawkAI senza interfaccia grafica (modalità WebServer)')
	argument_parser.add_argument('--port', type=int, default=8000, help='Porta su cui avviare il server web (default: 8000)')
	args = argument_parser.parse_args()

	if not args.no_gui and is_desktop_available():
		start_application()
	else:
		print(f"Avviando SquawkAI in modalità WebServer sulla porta {args.port}...")
		start_web_server(args.port)