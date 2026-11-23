import Script from 'next/script';
import '../css/index.css';
import '../css/features.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

const HANDWRITING_FONTS = [
  'The Girl Next Door',
  'Shadows Into Light Two',
  'Annie Use Your Telescope',
  'Waiting for the Sunrise',
  'Reenie Beanie',
  'Grape Nuts',
  'Just Another Hand',
  'Loved by the King',
  'Caveat',
  'Shadows Into Light',
  'Sue Ellen Francisco',
  'Square Peg',
  'Homemade Apple',
  'Nothing You Could Do',
  'Dawning of a New Day',
  'Cedarville Cursive',
  'La Belle Aurore',
  'Zeyada',
  'Ms Madi',
  'Oooh Baby',
  'Playwrite IN',
  'Kalam',
  'Nanum Pen Script',
  'Ma Shan Zheng'
];

const fontsHref =
  'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400&' +
  HANDWRITING_FONTS.map((f) => 'family=' + f.replace(/ /g, '+')).join('&') +
  '&display=swap';

export const metadata = {
  title: 'Inkwell',
  description:
    'Inkwell turns typed notes, markdown and tables into realistic handwritten notebook pages you can download as images or PDF.',
  manifest: `${base}/manifest.webmanifest`,
  icons: { icon: { url: `${base}/images/icon.svg`, type: 'image/svg+xml' } },
  robots: { follow: true },
  openGraph: {
    type: 'website',
    title: 'Inkwell',
    siteName: 'Inkwell',
    description: 'Turn typed notes into handwritten notebook pages'
  },
  other: { 'mobile-web-app-capable': 'yes' }
};

export const viewport = { themeColor: '#fafafa' };

// Runs before paint so the saved theme never flashes
const themeScript = `
function toggleTheme(toggleButton) {
  const dark = document.body.classList.toggle('dark');
  try { localStorage.setItem('prefers-theme', dark ? 'dark' : 'light'); } catch (e) {}
  if (toggleButton) {
    toggleButton.setAttribute('aria-pressed', dark);
    toggleButton.setAttribute('aria-label', dark ? 'Activate Light Mode' : 'Activate Dark Mode');
  }
}
let localPreference = null;
try { localPreference = localStorage.getItem('prefers-theme'); } catch (e) {}
if (localPreference) document.body.classList.toggle('dark', localPreference === 'dark');
else if (matchMedia('(prefers-color-scheme: dark)').matches) document.body.classList.add('dark');
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="stylesheet" href={fontsHref} />
      </head>
      {/* the theme script changes body's class before React hydrates */}
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.7/dist/html2canvas.min.js"
          integrity="sha384-XwGqoxmMMF8xk+Ej2su/exIBtJNvi1IFICihFq7toL+pib3rpsG8UKzU6tnBvgl6"
          crossOrigin="anonymous"
        />
        <Script src="https://unpkg.com/jspdf@1.5.3/dist/jspdf.min.js" />
      </body>
    </html>
  );
}
