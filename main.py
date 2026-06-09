import dotenv
import os
dotenv.load_dotenv()

base_dir = os.path.dirname(os.path.abspath(__file__))
dotenv.load_dotenv(os.path.join(base_dir, '.env'))
node_env: str = os.environ.get('NODE_ENV', 'production')

if __name__ == "__main__":
	from PySide6.QtCore import QUrl, Qt
	from PySide6.QtWidgets import QApplication
	from PySide6.QtWebEngineWidgets import QWebEngineView
	from PySide6.QtWebChannel import QWebChannel

	QApplication.setOrganizationName('Ruben Giuriato')
	QApplication.setOrganizationDomain('https://github.com/Rubbonn/SquawkAI')
	QApplication.setApplicationName('SquawkAI')

	app = QApplication([])

	browser = QWebEngineView()
	browser.setAttribute(Qt.WidgetAttribute.WA_DeleteOnClose)
	target = QUrl.fromLocalFile(os.path.join(base_dir, 'app/frontend/dist/index.html')) if node_env == 'production' else QUrl('http://localhost:5173')
	browser.load(target)
	browser.resize(1280, 1024)
	browser.show()

	if node_env == 'development':
		dev_tools = QWebEngineView()
		dev_tools.setWindowFlag(Qt.WindowType.WindowCloseButtonHint, False)
		browser.destroyed.connect(dev_tools.close)
		browser.page().setDevToolsPage(dev_tools.page())
		dev_tools.resize(1280, 512)
		dev_tools.show()

	channel = QWebChannel()
	from app.utils.bridge import bridge
	channel.registerObject('bridge', bridge)
	browser.page().setWebChannel(channel)

	app.exec()