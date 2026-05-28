from app.utils.models import Document
from app.utils.llm import get_chat_model
from base64 import standard_b64encode
from langchain.messages import HumanMessage, TextContentBlock, FileContentBlock
from pathlib import Path
from PySide6.QtCore import QObject, Signal, QSettings
from typing import cast

class DocumentIndex(QObject):
	document_added = Signal(Document)
	document_removed = Signal(Document)

	def __init__(self):
		super().__init__()
		self._documents: list[Document] = [Document(**doc) for doc in cast(list[dict], QSettings().value('documents', defaultValue=[], type=list))]

	def _save_documents(self) -> None:
		QSettings().setValue('documents', [d.model_dump() for d in self._documents])

	def add_document(self, path: str | Path) -> None:
		path = Path(path) if isinstance(path, str) else path
		if not path.exists() or not path.is_file():
			raise FileNotFoundError(f"File {path} does not exist.")
		
		if path.suffix.lower() != '.pdf':
			raise ValueError("Only PDF files are supported.")
		
		llm = get_chat_model(temperature=0).with_structured_output(Document)
		doc: Document = cast(Document, llm.invoke([HumanMessage(content_blocks=[TextContentBlock(type='text', text='Parse this PDF document extracting the required information. Do not fill the "name" and "path" fields.'), FileContentBlock(type='file', base64=standard_b64encode(path.read_bytes()).decode(), mime_type='application/pdf')])]))
		doc.name = path.stem
		doc.path = str(path)
		self._documents.append(doc)
		self._save_documents()
		self.document_added.emit(doc)

	def remove_document(self, name: str) -> None:
		doc = next((d for d in self._documents if d.name == name), None)
		if doc:
			self._documents.remove(doc)
			self._save_documents()
			self.document_removed.emit(doc)
	
	def empty(self) -> None:
		for doc in self._documents:
			self.document_removed.emit(doc)
		self._documents.clear()
		self._save_documents()

	def get_document(self, name: str) -> Document | None:
		doc = next((d for d in self._documents if d.name == name), None)
		if doc is None:
			raise ValueError(f"Document with name {name} not found.")
		
		if not Path(doc.path).exists():
			self.remove_document(name)
			raise FileNotFoundError(f"File for document {name} not found. The document has been removed from the index.")
		
		return doc

	@property
	def documents(self) -> list[dict]:
		return [d.model_dump() for d in self._documents]
	
document_index = DocumentIndex()