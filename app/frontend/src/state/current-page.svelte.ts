// Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3

type Page = 'map' | 'weather' | 'documents' | 'settings';

const currentPage: {
	page: Page;
} = $state({ page: 'map' });

export { currentPage };