from app.utils.models import Document
from app.utils.llm import get_chat_model
from base64 import standard_b64encode
from langchain.messages import HumanMessage, TextContentBlock, FileContentBlock
from pathlib import Path
from PySide6.QtCore import QObject, Signal, QSettings

class DocumentIndex(QObject):
    document_added = Signal(str)
    document_removed = Signal(str)

    def __init__(self):
        super().__init__()
        self._documents: list[Document] = [Document(**doc) for doc in QSettings().value('documents', defaultValue=[], type=list)]
        print(self._documents)

    def add_document(self, path: str | Path):
        path = Path(path) if isinstance(path, str) else path
        if not path.exists() or not path.is_file():
            raise FileNotFoundError(f"File {path} does not exist.")
        
        if path.suffix.lower() != '.pdf':
            raise ValueError("Only PDF files are supported.")
        
        llm = get_chat_model().with_structured_output(Document)
        doc: Document = llm.invoke([HumanMessage(content_blocks=[TextContentBlock(type='text', text='Parse this PDF document extracting the required information.'), FileContentBlock(type='file', base64=standard_b64encode(path.read_bytes()).decode(), mime_type='application/pdf')])])
        doc.name = path.stem
        doc.path = str(path)
        print(doc, doc.model_dump())
        self._documents.append(doc)
        self.document_added.emit(doc.name)
        QSettings().setValue('documents', [d.model_dump() for d in self._documents])