from app.utils.models import Point, Line
from typing import TypedDict

class MapState(TypedDict):
    points: list[Point]
    lines: list[Line]

map_state: MapState = {'points': [], 'lines': []}