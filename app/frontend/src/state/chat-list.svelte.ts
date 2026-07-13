// Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3

import { bridge } from '../services/backend-bridge.ts';

const chatList: {
	chats: Array<{
		id: string;
		name: string;
		messageList: string[];
	}>;
} = $state({
	chats: await bridge.getChatList()
});

export { chatList };