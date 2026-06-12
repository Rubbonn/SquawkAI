<style lang="scss">
	.chat {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		flex: 1;
		min-height: 0;

		&__history {
			display: flex;
			flex-direction: column;
			gap: var(--space-2);
			overflow-y: auto;
			margin: 0 calc(-1 * var(--space-3));
			padding: 0 var(--space-3);
		}

		&__message {
			padding: var(--space-2) var(--space-3);
			background-color: var(--bg-elevated);
			max-width: 100%;

			&--user {
				align-self: flex-end;
				border-radius: var(--radius-md) var(--radius-md) 0 var(--radius-md);
			}

			&--assistant {
				align-self: flex-start;
				border-radius: var(--radius-md) var(--radius-md) var(--radius-md) 0;
			}

			&-content :global(pre) {
				overflow-x: scroll;
			}
		}

		&__loader {
			display: flex;
			justify-content: center;
			padding: var(--space-2);
		}

		&__input {
			display: flex;
			gap: var(--space-2);

			textarea {
				resize: none;
				overflow-y: auto;
				max-height: 200px;
			}
		}
	}
</style>

{#snippet renderMessage(role: 'user' | 'assistant', content: string)}
	<div class="chat__message chat__message--{role}">
		<div class="chat__message-content bg-secondary">
			{@html content}
		</div>
	</div>
{/snippet}

<div class="chat h-100">
	<button class="btn btn-primary w-100" onclick={newChatHandler}>New Chat</button>
	<div class="chat__history h-100">
		{#each messageHistory as { role, content }}
			{@render renderMessage(role, content)}
		{/each}
		<div class="chat__loader" class:d-none={!waitingForResponse}><img src="/icons/compass-regular__text-primary.svg" class="spin" alt="Loading..." width="64" height="64"/></div>
	</div>
	<div class="chat__input">
		<textarea rows="1" class="w-100" name="message" placeholder="Type your message..." bind:this={textarea} oninput={adjustTextareaHeight} bind:value={message} disabled={waitingForResponse} onkeydown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}></textarea>
		<button class="btn btn-secondary text-small" onclick={sendMessage} disabled={waitingForResponse}>Send</button>
		
	</div>
	<p class="text-small technical">Press Shift + Enter for a new line</p>
</div>

<script lang="ts">
	import { bridge } from '../services/backend-bridge';
	import { marked } from 'marked';
	let textarea: HTMLTextAreaElement;
	let message: string = $state('');
	let messageHistory: { role: 'user' | 'assistant', content: string }[] = $state([]);
	let waitingForResponse: boolean = $state(false);
	let pendingMessages: number = 0;

	const adjustTextareaHeight = () => {
		if(!textarea) return;
		
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
	};

	const sendMessage = async () => {
		if(message.trim() === '' || waitingForResponse)
			return;

		messageHistory.push({ role: 'user', content: message });
		pendingMessages++;
		waitingForResponse = true;
		try {
			await bridge.sendMessage(message);
		} catch(error) {
			messageHistory.splice(-1, pendingMessages);
			adjustTextareaHeight();
			alert(`Error sending message: ${error instanceof Error ? error.message : String(error)}`);
		}
		message = '';
		waitingForResponse = false;
		pendingMessages = 0;
	};

	const handleMessageReceived = (newMessage: string) => {
		const parsedMessage = marked.parse(newMessage) as string;
		messageHistory.push({ role: 'assistant', content: parsedMessage });
		pendingMessages++;
		adjustTextareaHeight();
	};

	bridge.messageReceived(handleMessageReceived);

	const newChatHandler = async () => {
		await bridge.newThread();
		messageHistory = [];
		adjustTextareaHeight();
	}
</script>