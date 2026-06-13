import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// GitHub Pages config.
// - For a PROJECT site (https://<user>.github.io/<repo>/) set `base` to '/<repo>'.
// - For a USER/ORG site (https://<user>.github.io/) remove `base` (or set to '/').
// Update `site` to your final URL so canonical links/SEO are correct.
const SITE = 'https://novatus9.github.io';
const BASE = '/poe2-cheatsheets';

export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [preact()],
});
