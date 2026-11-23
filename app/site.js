// Public URL of the deployed site, e.g. https://m4milaad.github.io/inkwell
// The deploy workflow sets it from GitHub Pages; set it yourself for a custom domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const SITE_NAME = 'Inkwell';
export const TITLE = 'Inkwell: Free Text to Handwriting Converter';
export const DESCRIPTION =
  'Convert typed text into realistic handwriting on ruled notebook paper. 24 natural handwriting fonts, markdown and tables, multi-page PDF export. Free, no sign-up, runs in your browser.';

export const AUTHOR = { name: 'Milad', url: 'https://m4milaad.github.io' };

// One self-contained sentence answer engines can quote as-is
export const SUMMARY =
  'Inkwell is a free, browser-based text to handwriting converter that turns typed text, markdown and tables into realistic handwritten pages on ruled notebook paper, downloadable as JPG images or a single PDF.';

// Short, specific facts: the kind AI assistants extract and cite
export const FACTS = [
  ['Price', 'Free, no account, no watermark'],
  ['Works on', 'Any modern browser, desktop or phone'],
  ['Privacy', 'Runs fully in the browser; text is never uploaded'],
  ['Fonts', '24 handwriting fonts, or upload your own .ttf / .otf'],
  ['Languages', 'Latin scripts, plus Hindi, Korean and Chinese fonts'],
  ['Input', 'Plain text, markdown and tables'],
  ['Export', 'JPG per page or one multi-page PDF'],
  ['Paper', 'A4 ruled paper, margin, lighting effects or your own paper photo']
];

// Shared by the visible steps and the HowTo structured data
export const STEPS = [
  'Type or paste your text onto the page.',
  'Pick a handwriting font, ink colour, paper and spacing.',
  'Select Generate pages, then download each page as a JPG or all pages as one PDF.'
];

export const FEATURES = [
  "Fonts chosen because they look like ordinary people's writing: everyday print, cursive and school cursive, plus Hindi, Korean and Chinese.",
  'Natural variation gives every word its own height, tilt, size and ink pressure.',
  'Blue, black, red, green and pencil inks, ruled lines, a margin, scanner or shadow lighting, or a photo of your own paper.',
  'Markdown and tables are written out by hand, and long text flows onto as many pages as it needs.'
];

// Shown on the page and sent to Google as FAQ structured data, so both stay identical
export const FAQ = [
  {
    q: 'What is Inkwell?',
    a: SUMMARY
  },
  {
    q: 'How do I convert text to handwriting?',
    a:
      'Type or paste your text onto the page, pick a handwriting font, ink colour and paper, then select Generate pages. Download each page as an image or all pages as one PDF.'
  },
  {
    q: 'Is Inkwell free?',
    a: 'Yes. Inkwell is free, needs no account and has no watermark.'
  },
  {
    q: 'Is my text uploaded anywhere?',
    a:
      'No. Pages are generated in your browser, so your text never leaves your device.'
  },
  {
    q: 'Can I use my own handwriting?',
    a:
      'Yes. Turn a sample of your handwriting into a .ttf or .otf font file, for example with Calligraphr, and upload it under Handwriting, Own font.'
  },
  {
    q: 'Does it work with long assignments?',
    a:
      'Yes. Long text flows onto as many pages as it needs, breaking only between lines, and every new page starts on its first ruled line.'
  },
  {
    q: 'Can I paste markdown and tables?',
    a:
      'Yes. Headings, bold, italic, strikethrough, lists, checklists, quotes, code blocks and tables are written out by hand. Tables are drawn as a ruled grid and are never split across pages.'
  },
  {
    q: 'How do I make generated handwriting look less like a font?',
    a:
      'Use the Variation slider. It gives every word a slightly different height, tilt, size and ink pressure, the way real writing drifts. Around 40 looks natural; 0 turns it off.'
  },
  {
    q: 'Which handwriting fonts are included?',
    a:
      'Everyday print such as The Girl Next Door, Reenie Beanie and Caveat; cursive such as Homemade Apple, Cedarville Cursive and La Belle Aurore; school cursive (Playwrite IN); and Kalam for Hindi, Nanum Pen for Korean and Ma Shan Zheng for Chinese.'
  },
  {
    q: 'What can I download?',
    a:
      'Each generated page as a JPG image, or every page together as one PDF. Five quality levels go up to print resolution.'
  }
];
