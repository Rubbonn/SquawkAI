from langchain.agents import create_agent
from langchain.chat_models import init_chat_model, BaseChatModel
from PySide6.QtCore import QSettings
from typing import Callable

def get_chat_model(temperature: float = 0.7) -> BaseChatModel:
    google_api_key = str(QSettings().value('GOOGLE_API_KEY', defaultValue='', type=str))
    if not google_api_key:
        raise ValueError("Google API key not found in settings. Please set 'GOOGLE_API_KEY' in your application settings.")
    
    google_model = str(QSettings().value('GOOGLE_MODEL', defaultValue='gemini-3.5-flash', type=str))

    return init_chat_model(
        model=google_model,
        model_provider='google_genai',
        temperature=temperature,
        api_key=google_api_key
    )

def get_chat_agent(temperature: float = 0.7, tools: list[Callable] = []):
    return create_agent(
        model=get_chat_model(temperature=temperature),
        tools=tools,
    )
