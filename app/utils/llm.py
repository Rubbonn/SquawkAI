from langchain.agents import create_agent
from langchain.chat_models import init_chat_model, BaseChatModel
from PySide6.QtCore import QSettings
from typing import Callable

def get_chat_model(temperature: float = 0.7) -> BaseChatModel:
    gemini_api_key = QSettings().value('AistudioApiKey', defaultValue='', type=str)
    if not gemini_api_key:
        raise ValueError("Gemini API key not found in settings. Please set 'AistudioApiKey' in your application settings.")
    
    return init_chat_model(
        model='gemini-3.5-flash',
        model_provider='google_genai',
        temperature=temperature,
        api_key=gemini_api_key
    )

def get_chat_agent(temperature: float = 0.7, tools: list[Callable] = []):
    return create_agent(
        model=get_chat_model(temperature=temperature),
        tools=tools,
    )
