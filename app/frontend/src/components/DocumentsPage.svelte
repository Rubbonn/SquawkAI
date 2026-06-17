<style lang="scss">
	.documents-page {
		max-height: 100%;
		
		&__header {
			margin-bottom: var(--space-3);
		}

		&__content {
			display: flex;
			gap: var(--space-3);
		}

		&__right-column {
			max-height: 920px;
			overflow-y: auto;
			padding: 0 var(--space-1);
		}

		&__upload-area {
			position: relative;
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

		&__upload-disabled {
			height: 100%;
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #00000070;
			color: var(--accent);
			text-align: center;
		}
	}
</style>

<div class="documents-page">
	<div class="documents-page__header">
		<h2>Document Library</h2>
		<p class="text-small technical">Repository of active operational documentation.</p>
	</div>
	<div class="documents-page__content">
		<div class="documents-page__left-column">
			<div class="documents-page__upload-area">
				<img src="/icons/upload.png" alt="Upload Icon" width="48" height="48" />
				<p class="text-small technical">Upload operational manuals, NOTAMs, or charts. Supported formats: PDF, DOCX, TXT.</p>
				<button class="btn btn-primary" disabled={indexInProgress} onclick={handleFilesClick}>Select files</button>
				<button class="btn btn-primary" disabled={indexInProgress} onclick={handleFoldersClick}>Select folders</button>
				<div class="documents-page__upload-disabled" class:d-none={settings.GOOGLE_API_KEY}>
					<p><b>Set an Api Key in settings to use the document library feature</b></p>
				</div>
			</div>
		</div>
		<div class="documents-page__right-column">
			{#if Object.keys(documentTree).length > 0}
				{#await import("./CollapsibleCard.svelte") then { default: CollapsibleCard }}
					{#each Object.entries(documentTree) as [nation, sections] (nation)}
						<CollapsibleCard>
							{#snippet header()}
								<h3>{nation}</h3>
							{/snippet}
							{#each Object.entries(sections) as [section, docs] (section)}
								<CollapsibleCard>
									{#snippet header()}
										<h4>{section}</h4>
									{/snippet}
									{#each docs as doc}
										<CollapsibleCard>
											{#snippet header()}
												<h5>{doc.name}</h5>
												{#if !doc.file_exists}<small class="text-danger"><strong><img class="d-inline-block" src="/icons/triangle-exclamation-solid__text-danger.svg" width="13" height="13" alt="Warning icon"> ATTENTION: The file does not exists in the path, restore the file or remove this document</strong></small>{/if}
											{/snippet}
											<ul>
												<li><strong>Path:</strong> {doc.path}</li>
												<li><strong>Nation:</strong> {doc.nation}</li>
												<li><strong>Section:</strong> {doc.section}</li>
												<li><strong>Section Code:</strong> {doc.section_code}</li>
												<li><strong>AIRAC:</strong> {doc.airac}</li>
												<li><strong>Title:</strong> {doc.title}</li>
												<li><strong>Summary:</strong> {doc.summary}</li>
											</ul>
											<hr/>
											<button class="btn btn-invisible text-danger" onclick={() => handleRemoveDocument(doc.name)}><img class="d-inline-block" src="/icons/trash-can-solid__text-danger.svg" alt="Remove Document Icon" width="16" height="16" /> Remove Document</button>
										</CollapsibleCard>
									{/each}
								</CollapsibleCard>
							{/each}
						</CollapsibleCard>
					{/each}
				{/await}
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import { bridge } from '../services/backend-bridge.ts';
	import { settings } from '../state/settings.svelte.ts';
	import { documentIndex, type Document } from '../state/document-index.svelte';

	let indexInProgress = $state(false);

	const handleFilesClick = async () => {
		indexInProgress = true;
		try {
			await bridge.indexNewFiles();
			alert('Files indexed successfully!');
		} catch (error) {
			alert(`Failed to index files. Details: ${error instanceof Error ? error.message : String(error)}`);
		}
		indexInProgress = false;
	};

	const handleFoldersClick = async () => {
		indexInProgress = true;
		try {
			await bridge.indexNewFolder();
			alert('Folder indexed successfully!');
		} catch (error) {
			alert(`Failed to index folder. Details: ${error instanceof Error ? error.message : String(error)}`);
		}
		indexInProgress = false;
	};

	const handleRemoveDocument = async (doc: string) => {
		if(!confirm(`Are you sure you want to remove the document "${doc}"? This action cannot be undone.`)) {
			return;
		}
		
		try {
			await bridge.removeDocument(doc);
			alert('Document removed successfully!');
		} catch (error) {
			alert(`Failed to remove document. Details: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	let documentTree: { [nation: string]: { [section: string]: Document[] } } = $derived.by(() => {
		const tree: { [nation: string]: { [section: string]: Document[] } } = {};
		for(let doc of documentIndex.documents) {
			if(!tree[doc.nation]) {
				tree[doc.nation] = {};
			}
			if(!tree[doc.nation][doc.section]) {
				tree[doc.nation][doc.section] = [];
			}
			tree[doc.nation][doc.section].push(doc);
		}
		return tree;
	});
</script>