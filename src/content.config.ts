import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { categories } from './data/categories';
import type { CategoryId } from './data/categories';

const categoryIds = Object.keys(categories) as [
    CategoryId,
    ...CategoryId[]
];

const terms = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './src/content/terms',
    }),

    schema: z.object({
        title: z.string(),
        reading: z.string(),
        english: z.string().optional(),
       
        description: z.string(),
        updated: z.coerce.date(),
        categories: z.array(z.enum(categoryIds)).default([]),
        related: z.array(z.string()).default([]),
    }),
});

export const collections = {
    terms,
};