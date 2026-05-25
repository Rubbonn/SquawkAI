type Page = 'map' | 'weather' | 'documents';

const currentPage: {
	page: Page;
} = $state({ page: 'documents' });

export { currentPage };