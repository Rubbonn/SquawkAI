// Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3

import { bridge } from '../services/backend-bridge.ts';

const chatList: {
	chats: Record<string, {
		id: string;
		name: string;
		messageList: { role: 'user' | 'assistant', content: string }[];
	}>;
} = $state({
	chats: await bridge.getChatList()
});

export { chatList };