from PySide6.QtWidgets import QApplication
from PySide6.QtWebEngineWidgets import QWebEngineView

if __name__ == "__main__":
	app = QApplication([])

	browser = QWebEngineView()
	browser.setUrl('http://localhost:5173')
	browser.resize(1280, 1024)
	browser.show()

	app.exec()