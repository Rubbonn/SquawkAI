import dotenv
import os
dotenv.load_dotenv()

if __name__ == "__main__":
	from app.utils import Bridge
	from PySide6.QtCore import QUrl
	from PySide6.QtWidgets import QApplication
	from PySide6.QtWebEngineWidgets import QWebEngineView
	from PySide6.QtWebChannel import QWebChannel

	QApplication.setOrganizationName('Ruben Giuriato')
	QApplication.setOrganizationDomain('https://github.com/Rubbonn/SquawkAI')
	QApplication.setApplicationName('SquawkAI')
	app = QApplication([])

	browser = QWebEngineView()
	target = QUrl.fromLocalFile(os.path.abspath('app/frontend/dist/index.html')) if os.environ.get('NODE_ENV') == 'production' else QUrl('http://localhost:5173')
	browser.load(target)
	browser.resize(1280, 1024)
	browser.show()

	channel = QWebChannel()
	bridge = Bridge()
	channel.registerObject('bridge', bridge)
	browser.page().setWebChannel(channel)

	app.exec()