import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    publicDir: 'src/public',
    build: {
        outDir: 'dist',
        manifest: true,
    },
    plugins: [
        svelte({})
    ]
});