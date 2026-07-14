// Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3

import { type MapState } from '../lib/types';

const chatList: {
	chats: Record<string, {
		id: string;
		name: string;
		messageList: { role: 'user' | 'assistant', content: string }[];
		mapState: MapState;
	}>;
} = $state({
	chats: {
		'Chat 1': {
			id: 'Chat 1',
			name: 'Chat 1',
			messageList: [],
			mapState: { points: [], lines: [] }
		}
	}
});

export { chatList };