// Static export so the site can be hosted on GitHub Pages.
// NEXT_PUBLIC_BASE_PATH is the repo sub-path (e.g. /inkwell); the deploy workflow sets it.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default {
  output: 'export',
  basePath,
  images: { unoptimized: true }
};
