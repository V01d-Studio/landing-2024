import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://www.voidstudio.tech",
  integrations: [tailwind(), sitemap(), react()],
  output: "server",
  adapter: vercel(),
});
