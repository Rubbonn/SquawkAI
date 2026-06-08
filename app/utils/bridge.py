from app.utils.documents import document_index
from app.utils.llm import get_chat_agent
from langchain.messages import AIMessage, HumanMessage
from pathlib import Path
from PySide6.QtCore import QObject, Slot, Signal, QSettings
from uuid import uuid4

class Bridge(QObject):
	document_index_updated = Signal(list)
	message_received = Signal(str)

	def __init__(self):
		super().__init__()
		self._thread_id = str(uuid4())
		document_index.document_added.connect(lambda: self.document_index_updated.emit(document_index.documents))
		document_index.document_removed.connect(lambda: self.document_index_updated.emit(document_index.documents))

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

	@Slot(result=dict)
	def index_new_files(self) -> dict[str, str | bool]:
		from PySide6.QtWidgets import QFileDialog
		filenames = QFileDialog.getOpenFileNames(None, 'Select Files to Index', filter='PDF Files (*.pdf)')[0]
		if len(filenames) == 0:
			return {'error': 'No files selected.'}
		
		result: dict[str, str | bool] = {'error': False}
		for filename in filenames:
			try:
				document_index.add_document(filename)
			except Exception as e:
				result['error'] = f'Error indexing file {filename}: {e}\n'
		
		return result

	@Slot(result=dict)
	def index_new_folder(self) -> dict[str, str | bool]:
		from PySide6.QtWidgets import QFileDialog
		foldername = QFileDialog.getExistingDirectory(None, 'Select Folder to Index')
		if not foldername:
			return {'error': 'No folder selected.'}
		
		filenames = list(Path(foldername).rglob('*.pdf'))
		if len(filenames) == 0:
			return {'error': 'No PDF files found in the selected folder.'}
		
		result: dict[str, str | bool] = {'error': False}
		for path in filenames:
			try:
				document_index.add_document(path)
			except Exception as e:
				result['error'] = f'Error indexing file {path}: {e}\n'

		return result
	
	@Slot(result=list)
	def get_documents(self) -> list[dict]:
		return document_index.documents
	
	@Slot(str, result=dict)
	def send_message(self, message: str) -> dict[str, str | bool]:
		agent = get_chat_agent()
		thread_config = {"configurable": {"thread_id": self._thread_id}}
		try:
			for response in agent.stream({'messages': [HumanMessage(content=message)]}, config=thread_config, stream_mode='updates'):
				if response.get('model') is None:
					continue

				message_blocks = response['model']['messages'][-1].content_blocks
				for block in message_blocks:
					if block['type'] == 'text':
						self.message_received.emit(block['text'])
		except Exception as e:
			return {'error': str(e)}
		
		return {'error': False}
	
	@Slot()
	def new_thread(self) -> None:
		self._thread_id = str(uuid4())