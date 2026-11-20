// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://aliquanto3.github.io",
  output: "static",
  integrations: [react()],
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
