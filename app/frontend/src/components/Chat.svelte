<style lang="scss">
	.chat {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);

		&__history {
			display: flex;
			flex-direction: column;
			gap: var(--space-2);
			overflow-y: scroll;
			margin: 0 calc(-1 * var(--space-3));
			padding: 0 var(--space-3);

			&::-webkit-scrollbar {
				width: 0;
			}
		}

		&__message {
			padding: var(--space-2) var(--space-3);
			background-color: var(--bg-elevated);

			&--user {
				align-self: flex-end;
				border-radius: var(--radius-md) var(--radius-md) 0 var(--radius-md);
			}

			&--assistant {
				align-self: flex-start;
				border-radius: var(--radius-md) var(--radius-md) var(--radius-md) 0;
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
	<button class="btn btn-primary w-100">New Chat</button>
	<div class="chat__history h-100">
		{#each messageHistory as { role, content }}
			{@render renderMessage(role, content)}
		{/each}
		<div class="chat__loader"><img src="/icons/compass-regular__text-primary.svg" class="spin" alt="Loading..." width="64" height="64"/></div>
	</div>
	<div class="chat__input">
		<textarea rows="1" class="w-100" name="message" placeholder="Type your message..." bind:this={textarea} oninput={adjustTextareaHeight} bind:value={message}></textarea>
		<button class="btn btn-secondary text-small" onclick={sendMessage}>Send</button>
	</div>
</div>

<script lang="ts">
	import { bridge } from '../services/backend-bridge';
	import { marked } from 'marked';
	let textarea: HTMLTextAreaElement;
	let message: string = $state('');
	let messageHistory: { role: 'user' | 'assistant', content: string }[] = $state([]);

	const adjustTextareaHeight = () => {
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
	};

	const sendMessage = async () => {
		if(message.trim() === '')
			return;

		messageHistory.push({ role: 'user', content: message });
		const response = await bridge.sendMessage(message);
		const parsedResponse = marked.parse(response);
		messageHistory.push({ role: 'assistant', content: parsedResponse });
		message = '';
		adjustTextareaHeight();
	}
</script>