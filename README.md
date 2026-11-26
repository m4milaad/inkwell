# Inkwell

Turn typed notes into handwritten notebook pages.

Paste text or markdown onto the page, pick a handwriting font, ink and paper, and download the result as images or a single PDF. Everything runs in the browser; text never leaves the device.

## Features

- 25 hand-picked fonts that look like real people's writing (everyday print, cursive, school cursive), plus Hindi, Korean and Chinese, or upload your own `.ttf` / `.otf`
- Natural variation: every word sits, tilts and inks slightly differently, like real handwriting
- Five inks including pencil, and settings remembered between visits
- Markdown on paste: headings, bold, italic, strikethrough, lists, checklists, quotes, code blocks
- Tables drawn as a ruled grid, kept whole across page breaks
- Long text flows onto as many pages as needed, breaking only between lines
- Ruled lines, margins, lighting effects and a paper-photo background
- Simple drawing pad for diagrams

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository on the `main` branch.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` builds a static export and publishes it (`.github/workflows/deploy.yml`).

The site path is set automatically: `/<repo>` for a project site, the root for `<user>.github.io` or a custom domain. To build locally for a sub-path, set `NEXT_PUBLIC_BASE_PATH=/<repo>` before `npm run build`; the site is written to `out/`.

### Get it on Google

1. Add the site in [Google Search Console](https://search.google.com/search-console) as a **URL prefix** property, using the HTML tag method.
2. Copy only the `content` code from the tag into a repository variable named `GOOGLE_SITE_VERIFICATION` (**Settings → Secrets and variables → Actions → Variables**), re-run the deploy, then select **Verify**.
3. Submit `sitemap.xml` under **Sitemaps** and request indexing for the home page.

## Built with

- [Next.js](https://nextjs.org), as a static export
- [html2canvas](https://www.npmjs.com/package/html2canvas) to turn the page into an image
- [jsPDF](https://www.npmjs.com/package/jspdf) to bundle pages into a PDF

## License

Developed by [Milad](https://m4milaad.github.io).

© 2026 Inkwell. Released under the MIT License, see [LICENSE](LICENSE).
