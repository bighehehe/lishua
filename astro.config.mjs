import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.leeshua.com',
  devToolbar: {
    enabled: false
  },
  output: 'static',
  adapter: vercel(),
  integrations: [tailwind(), sitemap()]
});
