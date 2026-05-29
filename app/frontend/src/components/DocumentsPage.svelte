<style lang="scss">
	.documents-page {
		&__header {
			margin-bottom: var(--space-3);
		}

		&__left-column, &__right-column {
			float: left;
			width: 50%;
		}

		&__upload-area {
			background-color: var(--bg-surface);
			border: 2px dashed var(--border-default);
			border-radius: var(--radius-md);
			padding: var(--space-4);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: var(--space-2);
			text-align: center;
		}
	}
</style>

<div class="documents-page">
	<div class="documents-page__header">
		<h2>Document Library</h2>
		<p class="text-small technical">Repository of active operational documentation.</p>
	</div>
	<div class="documents-page__left-column">
		<div class="documents-page__upload-area">
			<img src="/icons/upload.png" alt="Upload Icon" width="48" height="48" />
			<p class="text-small technical">Upload operational manuals, NOTAMs, or charts. Supported formats: PDF, DOCX, TXT.</p>
			<button class="btn btn-primary" onclick={handleFilesClick}>Select files</button>
			<button class="btn btn-primary" onclick={handleFoldersClick}>Select folders</button>
		</div>
	</div>
	<div class="documents-page__right-column">
	</div>
</div>

<script lang="ts">
	import { bridge } from '../services/backend-bridge';
	import { documentIndex } from '../state/document-index.svelte';

	const handleFilesClick = async () => {
		try {
			let results = await bridge.indexNewFiles();
			if(results.error) {
				console.error('Error indexing files:', results.error);
				alert(`Failed to index some files. Details: ${results.error}`);
				return;
			}

			alert('Files indexed successfully!');
		} catch (error) {
			console.error('Error indexing files:', error);
			alert('Failed to index files. Please try again.');
		}
	};

	const handleFoldersClick = async () => {
		try {
			let results =await bridge.indexNewFolder();
			if(results.error) {
				console.error('Error indexing folder:', results.error);
				alert(`Failed to index folder. Details: ${results.error}`);
				return;
			}

			alert('Folder indexed successfully!');
		} catch (error) {
			console.error('Error indexing folder:', error);
			alert('Failed to index folder. Please try again.');
		}
	};
</script>