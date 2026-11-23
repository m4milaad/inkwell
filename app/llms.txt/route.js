import {
  AUTHOR,
  FACTS,
  FAQ,
  FEATURES,
  SITE_NAME,
  SITE_URL,
  STEPS,
  SUMMARY
} from '../site';

export const dynamic = 'force-static';

// llms.txt (llmstxt.org): a plain markdown brief for AI assistants and answer engines
export function GET() {
  const body = `# ${SITE_NAME}

> ${SUMMARY}

${SITE_NAME} is free to use at ${SITE_URL}/ and was developed by ${
    AUTHOR.name
  } (${AUTHOR.url}).

## Facts

${FACTS.map(([label, value]) => `- ${label}: ${value}`).join('\n')}

## How to convert text to handwriting

${STEPS.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Features

${FEATURES.map((f) => `- ${f}`).join('\n')}

## FAQ

${FAQ.map(({ q, a }) => `### ${q}\n\n${a}`).join('\n\n')}

## Links

- [${SITE_NAME}](${SITE_URL}/): the converter
- [Sitemap](${SITE_URL}/sitemap.xml)
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
