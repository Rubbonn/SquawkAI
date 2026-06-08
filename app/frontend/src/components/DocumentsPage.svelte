<style lang="scss">
	.documents-page {
		&__header {
			margin-bottom: var(--space-3);
		}

		&__left-column, &__right-column {
			float: left;
			width: 50%;
			padding: 0 var(--space-2);
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

<script lang="ts">
	import { bridge } from '../services/backend-bridge';
	import { documentIndex, type Document } from '../state/document-index.svelte';

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