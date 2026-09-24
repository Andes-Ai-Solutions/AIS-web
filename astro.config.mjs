// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO: cambiar por la URL real cuando se publique (Netlify o dominio propio)
  site: 'https://andesaisolutions.netlify.app',
  integrations: [icon(), sitemap()],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
