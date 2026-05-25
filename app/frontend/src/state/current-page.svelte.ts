type Page = 'map' | 'weather' | 'documents';

const currentPage: {
	page: Page;
} = $state({ page: 'map' });

export { currentPage };