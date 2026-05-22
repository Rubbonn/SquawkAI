type Page = 'map' | 'weather' | 'documents';

const currentPage: {
	page: Page;
} = $state({ page: 'weather' });

export { currentPage };