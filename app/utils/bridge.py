from app.llm.llm import get_chat_agent
from app.llm.tools import get_airport_weather, get_available_documents, get_document, set_map_state, get_map_state, get_current_datetime
from app.utils.documents import document_index
from langchain_core.runnables.config import RunnableConfig
from langchain.messages import HumanMessage, SystemMessage
from pathlib import Path
from PySide6.QtCore import QObject, Slot, Signal, QSettings
from uuid import uuid4

_system_message = '''You're a helpful assistant for pilots.
You can provide informations about airports, weather, procedures eccetera.
Don't use your own knowledge. Use the documents available to ground your answers. If you don't know the answer to a question, say you don't know. Don't try to make up an answer.
You can also plan entire flights, providing detailed procedures and weather information.
Use the map to complete your answers with visual information. You can set the map state to show specific locations, routes and so on.
If the user asks questions about other topics not related to aviation, steer the conversation back to aviation topics.
Answer in a friendly and professional manner, as if you were a real pilot with years of experience.'''

class Bridge(QObject):
	document_index_updated = Signal(list)
	message_received = Signal(str)
	map_state_updated = Signal(dict)

	def __init__(self):
		super().__init__()
		self._thread_id = str(uuid4())
		agent = get_chat_agent()
		agent.update_state(RunnableConfig(configurable={'thread_id': self._thread_id}), {'messages': [SystemMessage(content=_system_message)]})
		document_index.document_added.connect(lambda: self.document_index_updated.emit(document_index.documents))
		document_index.document_removed.connect(lambda: self.document_index_updated.emit(document_index.documents))

	@Slot(str, result=dict)
	def get_airport_weather(self, icao: str) -> dict:
		return get_airport_weather(icao)
	
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
	
	@Slot(str, result=dict)
	def remove_document(self, name: str) -> dict[str, str | bool]:
		try:
			document_index.remove_document(name)
			return {'error': False}
		except Exception as e:
			return {'error': str(e)}
	
	@Slot(result=list)
	def get_documents(self) -> list[dict]:
		return document_index.documents
	
	@Slot(str, result=dict)
	def send_message(self, message: str) -> dict[str, str | bool]:
		agent = get_chat_agent(tools=[get_airport_weather, get_available_documents, get_document, get_map_state, set_map_state, get_current_datetime])
		thread_config = {"thread_id": self._thread_id}
		try:
			for response in agent.stream({'messages': [HumanMessage(content=message)]}, config=RunnableConfig(configurable=thread_config), stream_mode='updates'):
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
		agent = get_chat_agent()
		agent.update_state(RunnableConfig(configurable={'thread_id': self._thread_id}), {'messages': [SystemMessage(content=_system_message)]})

bridge = Bridge()