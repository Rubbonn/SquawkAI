from pydantic import BaseModel, Field
from typing import Literal, Optional

class Document(BaseModel):
    name: str = Field(description='The name of the document, typically the filename without extension.')
    path: str = Field(description='The full path to the document on the local filesystem.')
    nation: str = Field(description='The nation associated with the document, e.g., Italy, France, etc.')
    section: Literal['GEN', 'ENR', 'AD'] = Field(description='The section of the document, e.g., GEN for General, ENR for Enroute, AD for Aerodromes.')
    section_code: str = Field(description='The code of the section, e.g., 1, 1.1, 2.3, 3.2.3, etc.')
    airac: str = Field(description='The AIRAC cycle associated with the document, e.g., 2305, 2306, etc. Use only numbers, no separators.')
    title: str = Field(description='The title of the document, typically extracted from the PDF metadata or content.')
    summary: str = Field(description='A summary of the document scope and content.')