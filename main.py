if __name__ == "__main__":
	from app.utils import Bridge
	from PySide6.QtCore import QUrl
	from PySide6.QtWidgets import QApplication
	from PySide6.QtWebEngineWidgets import QWebEngineView
	from PySide6.QtWebChannel import QWebChannel
	app = QApplication([])

	browser = QWebEngineView()
	browser.load(QUrl('http://localhost:5173'))
	browser.resize(1280, 1024)
	browser.show()

	channel = QWebChannel()
	bridge = Bridge()
	channel.registerObject('bridge', bridge)
	browser.page().setWebChannel(channel)

	app.exec()