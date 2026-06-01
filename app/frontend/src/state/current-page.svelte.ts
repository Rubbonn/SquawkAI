type Page = 'map' | 'weather' | 'documents' | 'settings';

const currentPage: {
	page: Page;
} = $state({ page: 'map' });

export { currentPage };