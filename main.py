import dotenv
import os
dotenv.load_dotenv()

if __name__ == "__main__":
	from app.utils.bridge import Bridge
	from PySide6.QtCore import QUrl
	from PySide6.QtWidgets import QApplication
	from PySide6.QtWebEngineWidgets import QWebEngineView
	from PySide6.QtWebChannel import QWebChannel

	QApplication.setOrganizationName('Ruben Giuriato')
	QApplication.setOrganizationDomain('https://github.com/Rubbonn/SquawkAI')
	QApplication.setApplicationName('SquawkAI')

	from app.utils.llm import get_chat_model, get_chat_agent
	from langchain.messages import HumanMessage, TextContentBlock, FileContentBlock
	import sys
	llm = get_chat_agent()
	print(llm.invoke({'messages':[HumanMessage(content_blocks=[TextContentBlock(type='text', text='Ciao! Esamina questo pdf'), FileContentBlock(type='file', url='https://www.awn.it/attachments/article/1280/Allegato_B_Istruzioni_creazione_PDF.pdf')])]}))
	sys.exit(0)

	app = QApplication([])

	browser = QWebEngineView()
	target = QUrl('http://localhost:4173') if os.environ.get('NODE_ENV') == 'production' else QUrl('http://localhost:5173')
	browser.load(target)
	browser.resize(1280, 1024)
	browser.show()

	channel = QWebChannel()
	bridge = Bridge()
	channel.registerObject('bridge', bridge)
	browser.page().setWebChannel(channel)

	app.exec()