'''
Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3
'''

from typing import TypedDict, Optional

class Point(TypedDict):
    lat: float
    lng: float
    name: Optional[str]
    
class Line(TypedDict):
    points: list[Point]
    name: Optional[str]

class MapState(TypedDict):
    points: list[Point]
    lines: list[Line]

map_state: MapState = {'points': [], 'lines': []}