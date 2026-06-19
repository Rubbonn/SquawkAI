'''
Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3
'''

from PySide6.QtCore import QThread, Signal
from typing import Callable, Any

class GenericWorker(QThread):
	result_ready = Signal(object)
	runtime_error = Signal(Exception)

	def __init__(self, func: Callable, *args, **kwargs):
		super().__init__()
		self._func = func
		self._args = args
		self._kwargs = kwargs
	
	def run(self):
		try:
			result = self._func(*self._args, **self._kwargs)
			self.result_ready.emit(result)
		except Exception as e:
			self.runtime_error.emit(e)