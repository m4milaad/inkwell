import { SITE_URL } from './site';

export const dynamic = 'force-static';

// Named explicitly so answer engines (ChatGPT, Claude, Perplexity, Gemini,
// Apple, Bing Copilot) can crawl and cite the site, not just classic search
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot'
];

// shortcut: on a project site (user.github.io/repo) crawlers only read robots.txt
// at the domain root, so this file takes effect once you use a custom domain
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
