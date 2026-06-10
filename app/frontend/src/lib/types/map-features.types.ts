export interface Point {
	lat: number;
	lng: number;
	name?: string;
}

export interface Line {
	points: Point[];
	name?: string;
}

export interface MapState {
	points: Point[];
	lines: Line[];
}