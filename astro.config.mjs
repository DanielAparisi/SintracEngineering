// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Dominio de producción. De aquí salen el canonical, `og:url` y el sitemap;
  // sin él, Astro los resolvería contra `localhost` en dev y contra el host de
  // despliegue en build.
  site: "https://sintracengineering.es",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});