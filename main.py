import dotenv
import os
dotenv.load_dotenv()

base_dir = os.path.dirname(os.path.abspath(__file__))
dotenv.load_dotenv(os.path.join(base_dir, '.env'))
node_env: str = os.environ.get('NODE_ENV', 'production')

if __name__ == "__main__":
	from app.windows import MainWindow
	from PySide6.QtCore import QUrl
	from PySide6.QtWidgets import QApplication
	from PySide6.QtWebChannel import QWebChannel

	QApplication.setOrganizationName('Ruben Giuriato')
	QApplication.setOrganizationDomain('https://github.com/Rubbonn/SquawkAI')
	QApplication.setApplicationName('SquawkAI')

	app = QApplication([])

	browser = MainWindow(debug=(node_env == 'development'))
	target = QUrl.fromLocalFile(os.path.join(base_dir, 'app/frontend/dist/index.html')) if node_env == 'production' else QUrl('http://localhost:5173')
	browser.load(target)
	browser.setFixedSize(1280, 1024)
	browser.show()

	channel = QWebChannel()
	from app.utils.bridge import bridge
	channel.registerObject('bridge', bridge)
	browser.page().setWebChannel(channel)

	app.exec()