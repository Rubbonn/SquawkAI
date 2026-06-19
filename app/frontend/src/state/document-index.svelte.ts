// Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3

import { bridge } from '../services/backend-bridge';

interface Document {
    name: string;
    path: string;
    nation: string;
    section: 'GEN' | 'ENR' | 'AD';
    section_code: string;
    airac: string;
    title: string;
    summary: string;
    file_exists: boolean;
}

let documentIndex: {
    documents: Document[];
} = $state({ documents: await bridge.getDocuments() });

bridge.documentIndexUpdated((documents) => {
    documentIndex.documents = documents;
});

export { type Document, documentIndex };