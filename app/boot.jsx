'use client';

import { useEffect } from 'react';

// The editor is plain DOM code; start it once the markup is on the page.
export default function Boot() {
  useEffect(() => {
    import('../js/app.mjs');

    const toggle = document.querySelector('.dark-mode-toggle');
    const onClick = () => window.toggleTheme(toggle);
    toggle.addEventListener('click', onClick);
    return () => toggle.removeEventListener('click', onClick);
  }, []);

  return null;
}
