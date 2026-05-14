type Page = 'chat' | 'weather' | 'documents';

const currentPage: {
	page: Page;
} = $state({ page: 'chat' });

export { currentPage };