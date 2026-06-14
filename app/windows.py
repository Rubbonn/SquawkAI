from PySide6.QtCore import Qt
from PySide6.QtGui import QCloseEvent
from PySide6.QtWebEngineWidgets import QWebEngineView

class MainWindow(QWebEngineView):
	def __init__(self, debug: bool = False):
		super().__init__()
		self.setAttribute(Qt.WidgetAttribute.WA_DeleteOnClose)
		self._web_tools = None

		if debug:
			self._web_tools = QWebEngineView()
			self._web_tools.setAttribute(Qt.WidgetAttribute.WA_DeleteOnClose)
			self._web_tools.setWindowFlag(Qt.WindowType.WindowCloseButtonHint, False)
			self._web_tools.resize(1280, 512)
			self.page().setDevToolsPage(self._web_tools.page())
		else:
			self.setContextMenuPolicy(Qt.ContextMenuPolicy.NoContextMenu)
	
	def closeEvent(self, event: QCloseEvent) -> None:
		if self._web_tools is not None:
			self.page().setDevToolsPage(None)  # type: ignore[arg-type]
			self._web_tools.close()
		return super().closeEvent(event)
	
	def show(self) -> None:
		super().show()
		if self._web_tools is not None:
			self._web_tools.show()