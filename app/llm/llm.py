'''
Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3
'''

from langchain.agents import create_agent
from langchain.chat_models import init_chat_model, BaseChatModel
from langgraph.checkpoint.memory import InMemorySaver
from PySide6.QtCore import QSettings
from typing import Callable

_checkpointer = InMemorySaver()

def get_chat_model(temperature: float = 0.7) -> BaseChatModel:
	google_api_key = str(QSettings().value('GOOGLE_API_KEY', defaultValue='', type=str))
	if not google_api_key:
		raise ValueError("Google API key not found in settings. Please set 'GOOGLE_API_KEY' in your application settings.")
	
	google_model = str(QSettings().value('GOOGLE_MODEL', defaultValue='', type=str))

	return init_chat_model(
		model=google_model,
		model_provider='google_genai',
		temperature=temperature,
		api_key=google_api_key
	)

def get_chat_agent(temperature: float = 0.7, tools: list[Callable] = [], system_prompt: str = ''):
	from langchain.agents.middleware import wrap_tool_call
	from langchain.messages import ToolMessage
	from langchain.tools.tool_node import ToolCallRequest
	from langgraph.types import Command

	@wrap_tool_call
	def handle_tool_errors(
		request: ToolCallRequest,
		handler: Callable[[ToolCallRequest], ToolMessage | Command],
	) -> ToolMessage | Command:
		"""Convert tool exceptions into ToolMessages the model can handle."""
		try:
			return handler(request)
		except Exception as e:
			return ToolMessage(
				content=f"Tool call error: {e}",
				tool_call_id=request.tool_call['id'],
			)
	
	return create_agent(
		model=get_chat_model(temperature=temperature),
		tools=tools,
		system_prompt=system_prompt,
		middleware=[handle_tool_errors],
		checkpointer=_checkpointer,
	)
