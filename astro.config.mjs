import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://datavism.org',
  integrations: [svelte()],
  vite: { plugins: [tailwindcss()] },
})
