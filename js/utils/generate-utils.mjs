const pageEl = document.querySelector('.page-a');
const paperContentEl = document.querySelector('.page-a .paper-content');
const overlayEl = document.querySelector('.overlay');

let paperContentPadding;

function isFontErrory() {
  // SOme fonts have padding top errors, this functions tells you if the current font has that;
  const currentHandwritingFont = document.body.style.getPropertyValue(
    '--handwriting-font'
  );
  return (
    currentHandwritingFont === '' ||
    currentHandwritingFont.includes('Homemade Apple')
  );
}

function applyPaperStyles() {
  pageEl.style.border = 'none';
  pageEl.style.overflowY = 'hidden';

  // Adding class shadows even if effect is scanner
  if (document.querySelector('#page-effects').value === 'scanner') {
    overlayEl.classList.add('shadows');
  } else {
    overlayEl.classList.add(document.querySelector('#page-effects').value);
  }

  if (document.querySelector('#page-effects').value === 'scanner') {
    // For scanner, we need shadow between 50deg to 120deg only
    // Since If the lit part happens to be on margins, the margins get invisible
    overlayEl.style.background = `linear-gradient(${
      Math.floor(Math.random() * (120 - 50 + 1)) + 50
    }deg, #0008, #0000)`;
  } else if (document.querySelector('#page-effects').value === 'shadows') {
    overlayEl.style.background = `linear-gradient(${
      Math.random() * 360
    }deg, #0008, #0000)`;
  }

  if (isFontErrory() && document.querySelector('#font-file').files.length < 1) {
    paperContentPadding =
      paperContentEl.style.paddingTop.replace(/px/g, '') || 5;
    const newPadding = Number(paperContentPadding) - 5;
    paperContentEl.style.paddingTop = `${newPadding}px`;
  }
}

function removePaperStyles() {
  pageEl.style.overflowY = 'auto';
  pageEl.style.border = '';

  if (document.querySelector('#page-effects').value === 'scanner') {
    overlayEl.classList.remove('shadows');
  } else {
    overlayEl.classList.remove(document.querySelector('#page-effects').value);
  }

  if (isFontErrory()) {
    paperContentEl.style.paddingTop = `${paperContentPadding}px`;
  }
}

const icon = (name) =>
  `<svg class="icon" aria-hidden="true"><use href="#i-${name}" /></svg>`;

function renderOutput(outputImages) {
  const count = outputImages.length;
  document.querySelector('#output-header').innerHTML =
    'Pages' + (count ? ` <span class="count">${count}</span>` : '');
  document
    .querySelector('#download-as-pdf-button')
    .classList.toggle('show', count > 0);
  document
    .querySelector('#delete-all-button')
    .classList.toggle('show', count > 0);

  if (count <= 0) {
    document.querySelector('#output').innerHTML =
      'Your generated pages will appear here.';
    return;
  }

  document.querySelector('#output').innerHTML = outputImages
    .map((outputImageCanvas, index) => {
      const src = outputImageCanvas.toDataURL('image/jpeg');
      const n = index + 1;
      return /* html */ `
    <div class="output-image-container" style="position: relative;">
      <button type="button" data-index="${index}" aria-label="Remove page ${n}"
        class="btn close-button close-${index}">${icon('x')}</button>
      <button type="button" class="page-open" data-index="${index}"
        aria-label="Preview page ${n}">
        <img alt="Output image ${index}" src="${src}" />
      </button>
      <div class="page-tools">
        <span class="page-number">${String(n).padStart(2, '0')}</span>
        <div class="tool-group">
          <button type="button" class="btn btn-ghost move-left" data-index="${index}"
            aria-label="Move page ${n} left">${icon('left')}</button>
          <a class="btn btn-ghost download-image-button" download="page-${n}.jpg"
            href="${src}" aria-label="Download page ${n}">${icon(
        'download'
      )}</a>
          <button type="button" class="btn btn-ghost move-right" data-index="${index}"
            aria-label="Move page ${n} right">${icon('right')}</button>
        </div>
      </div>
    </div>`;
    })
    .join('');
}

/**
 * A word too long for one line wraps in the browser, but html2canvas draws
 * each word on a single line. Mark break points (zero-width spaces) inside
 * only the words that actually wrap, so the image breaks where the page does.
 * @param {HTMLElement} root
 */
function addBreaksInWrappedWords(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  const range = document.createRange();

  for (const node of textNodes) {
    const text = node.textContent;
    let changed = false;
    const parts = text.split(/(\s+)/).map((part, i, all) => {
      if (part.length < 8 || !part.trim()) return part;
      const start = all.slice(0, i).join('').length;
      range.setStart(node, start);
      range.setEnd(node, start + part.length);
      const lines = new Set(
        [...range.getClientRects()].map((rect) => Math.round(rect.top))
      );
      if (lines.size < 2) return part;
      changed = true;
      return [...part].join('\u200B');
    });
    if (changed) node.textContent = parts.join('');
  }
}

/**
 * Real handwriting is never perfectly even: give every word a small random
 * lift, tilt, size and ink-pressure change. Layout is untouched (transforms
 * and opacity only), so pages break exactly as measured.
 * @param {HTMLElement} root element whose text gets the variation
 * @param {number} amount 0 (none) to 1 (strong)
 */
function addHandwritingVariation(root, amount) {
  if (!amount) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  const jitter = () => Math.random() * 2 - 1;

  for (const node of textNodes) {
    if (!node.textContent.trim()) continue;
    const fragment = document.createDocumentFragment();
    for (const part of node.textContent.split(/(\s+)/)) {
      if (!part) continue;
      // whitespace, and words already broken across lines, stay plain text
      if (!part.trim() || part.includes('\u200B')) {
        fragment.append(part);
        continue;
      }
      const word = document.createElement('span');
      word.textContent = part;
      word.style.display = 'inline-block';
      word.style.transform =
        `translateY(${(jitter() * 2 * amount).toFixed(2)}px) ` +
        `rotate(${(jitter() * 2.5 * amount).toFixed(2)}deg) ` +
        `scale(${(1 + jitter() * 0.05 * amount).toFixed(3)})`;
      word.style.opacity = (1 - Math.random() * 0.3 * amount).toFixed(2);
      fragment.append(word);
    }
    node.replaceWith(fragment);
  }
}

export {
  removePaperStyles,
  applyPaperStyles,
  renderOutput,
  addBreaksInWrappedWords,
  addHandwritingVariation
};
