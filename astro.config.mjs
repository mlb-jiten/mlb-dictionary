
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import autoLinkTerms from './src/plugins/autoLinkTerms.mjs';

export default defineConfig({
    markdown: {
        processor: unified({
            remarkPlugins: [autoLinkTerms],
        }),
    },
});
