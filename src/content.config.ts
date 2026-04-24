import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
	schema: z.object({
		title: z.string(),
		date: z.date(),
		description: z.string(),
		image: z.string().optional(),
	}),
});

export const collections = {
	'news': newsCollection,
};
