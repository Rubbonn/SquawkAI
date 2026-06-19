'''
SquawkAI è un copilota digitale locale per piloti e operatori aeronautici che unisce chat AI, meteo operativo, mappe e consultazione documentale in un'unica app desktop.
Copyright (C) 2026  Ruben Giuriato

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
'''

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