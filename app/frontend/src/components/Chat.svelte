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

		&__input {
			display: flex;
			gap: var(--space-2);
		}
	}
</style>

<div class="chat h-100">
	<button class="btn btn-primary w-100">New Chat</button>
	<div class="chat__history h-100">
		<div class="chat__message chat__message--user">
			<div class="chat__message-content bg-secondary">
				Hello, how are you?
			</div>
		</div>
		<div class="chat__message chat__message--assistant">
			<div class="chat__message-content bg-secondary">
				I'm good, thank you! How can I assist you today?
				<br/><br/>
				Here are some things I can help with:
				<ul>
					<li>Answering questions</li>
					<li>Providing information</li>
					<li>Generating text</li>
					<li>And much more!</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="chat__input">
		<input type="text" class="w-100" name="message" placeholder="Type your message..."/>
		<button class="btn btn-secondary text-small">Send</button>
	</div>
</div>