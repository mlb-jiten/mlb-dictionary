
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import autoLinkTerms from './src/plugins/autoLinkTerms.mjs';

export default defineConfig({
    site: 'https://mlb-dictionary.pages.dev',

    integrations: [
        sitemap({
            filter: (page) =>
                page !== 'https://mlb-dictionary.pages.dev/search/' &&
                page !== 'https://mlb-dictionary.pages.dev/contact/thanks/',
        }),
    ],

    markdown: {
        processor: unified({
            remarkPlugins: [autoLinkTerms],
        }),
    },
});
