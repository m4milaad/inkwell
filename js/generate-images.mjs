import {
  applyPaperStyles,
  removePaperStyles,
  renderOutput,
  addBreaksInWrappedWords,
  addHandwritingVariation
} from './utils/generate-utils.mjs';
import { createPDF } from './utils/helpers.mjs';

const pageEl = document.querySelector('.page-a');
let outputImages = [];

/**
 * To generate image, we add styles to DIV and converts that HTML Element into Image.
 * This is the function that deals with it.
 */
async function convertDIVToImage() {
  const options = {
    scrollX: 0,
    scrollY: -window.scrollY,
    scale: document.querySelector('#resolution').value,
    useCORS: true
  };

  // Natural variation is applied only to the captured page, then undone
  const paperContentEl = pageEl.querySelector('.paper-content');
  const pageHTML = paperContentEl.innerHTML;
  addBreaksInWrappedWords(paperContentEl);
  addHandwritingVariation(
    paperContentEl,
    Number(document.querySelector('#variation').value) / 100
  );

  /** Function html2canvas comes from a library html2canvas which is included in the index.html */
  const canvas = await html2canvas(pageEl, options);
  paperContentEl.innerHTML = pageHTML;

  /** Send image data for modification if effect is scanner */
  if (document.querySelector('#page-effects').value === 'scanner') {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    contrastImage(imageData, 0.55);
    canvas.getContext('2d').putImageData(imageData, 0, 0);
  }

  outputImages.push(canvas);
}

/**
 * This is the function that gets called on clicking "Generate Image" button.
 */
export async function generateImages() {
  // a font picked a moment ago may still be downloading; never capture the fallback
  await document.fonts.ready;
  applyPaperStyles();
  pageEl.scroll(0, 0);

  const paperContentEl = document.querySelector('.page-a .paper-content');
  const scrollHeight = paperContentEl.scrollHeight;
  const clientHeight = 514; // height of .paper-content when there is no content

  const totalPages = Math.ceil(scrollHeight / clientHeight);

  if (totalPages > 1) {
    // For multiple pages
    if (paperContentEl.innerHTML.includes('<img')) {
      alert(
        "You're trying to generate more than one page, Images and some formatting may not work correctly with multiple images" // eslint-disable-line max-len
      );
    }
    const initialPaperContent = paperContentEl.innerHTML;
    // Split on <br> too, so the last word of a line is not glued to the next line's first word
    const separator = /^(\s+|<br\s*\/?>|&nbsp;)$/i;
    const tokens = initialPaperContent
      // lines typed in the editor are <div>s: flatten them to <br> so empty
      // lines become separators that a new page can drop
      .replace(/<div[^>]*>\s*<br\s*\/?>\s*<\/div>/gi, '<br>')
      .replace(/<div[^>]*>/gi, '<br>')
      .replace(/<\/div>/gi, '')
      // shortcut: a table is one unbreakable token, so a table taller than a page gets clipped; split by rows if that becomes common
      .split(/(<table[\s\S]*?<\/table>|\s+|<br\s*\/?>)/i)
      .filter(Boolean)
      // a very long word (a URL, a hash) can be taller than a page: page it
      // one character at a time, keeping tags and entities whole
      .flatMap((token) =>
        token.length > 30 && !separator.test(token) && !/^<table/i.test(token)
          ? token.match(/<[^>]*>|&[#\w]+;|[^<&]/g)
          : [token]
      );

    // multiple images: keep making pages until every token is used
    let i = 0;
    let openTags = [];
    while (i < tokens.length) {
      // don't start a page with blank lines
      while (i < tokens.length && separator.test(tokens[i])) i++;
      if (i >= tokens.length) break;

      const start = i;
      // reopen formatting (e.g. bold) that was cut by the previous page break
      let html = openTags.map((t) => `<${t}>`).join('');
      while (i < tokens.length) {
        paperContentEl.innerHTML = html + tokens[i];
        if (paperContentEl.scrollHeight > clientHeight && i > start) break;
        html += tokens[i];
        i++;
      }
      paperContentEl.innerHTML = html;
      openTags = [];
      for (const [, close, tag] of html.matchAll(/<(\/?)(b|i|u|s)>/gi)) {
        const at = openTags.lastIndexOf(tag.toLowerCase());
        if (!close) openTags.push(tag.toLowerCase());
        else if (at !== -1) openTags.splice(at, 1);
      }
      pageEl.scrollTo(0, 0);
      await convertDIVToImage();
      paperContentEl.innerHTML = initialPaperContent;
    }
  } else {
    // single image
    await convertDIVToImage();
  }

  removePaperStyles();
  renderOutput(outputImages);
  setRemoveImageListeners();
}

/**
 * Delete all generated images
 */

export const deleteAll = () => {
  outputImages.splice(0, outputImages.length);
  renderOutput(outputImages);
};

const arrayMove = (arr, oldIndex, newIndex) => {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr; // for testing
};

export const moveLeft = (index) => {
  if (index === 0) return outputImages;
  outputImages = arrayMove(outputImages, index, index - 1);
  renderOutput(outputImages);
};

export const moveRight = (index) => {
  if (index + 1 === outputImages.length) return outputImages;
  outputImages = arrayMove(outputImages, index, index + 1);
  renderOutput(outputImages);
};

/**
 * Downloads generated images as PDF
 */
export const downloadAsPDF = () => createPDF(outputImages);

/**
 * Sets event listeners for close button on output images.
 */
function setRemoveImageListeners() {
  document
    .querySelectorAll('.output-image-container > .close-button')
    .forEach((closeButton) => {
      closeButton.addEventListener('click', (e) => {
        outputImages.splice(Number(e.target.dataset.index), 1);
        renderOutput(outputImages);
        // When output changes, we have to set remove listeners again
        setRemoveImageListeners();
      });
    });

  document.querySelectorAll('.move-left').forEach((leftButton) => {
    leftButton.addEventListener('click', (e) => {
      moveLeft(Number(e.target.dataset.index));
      // Displaying no. of images on deletion
      renderOutput(outputImages);
      // When output changes, we have to set remove listeners again
      setRemoveImageListeners();
    });
  });

  document.querySelectorAll('.move-right').forEach((rightButton) => {
    rightButton.addEventListener('click', (e) => {
      moveRight(Number(e.target.dataset.index));
      // Displaying no. of images on deletion
      renderOutput(outputImages);
      // When output changes, we have to set remove listeners again
      setRemoveImageListeners();
    });
  });
}

/** Modifies image data to add contrast */

function contrastImage(imageData, contrast) {
  const data = imageData.data;
  contrast *= 255;
  const factor = (contrast + 255) / (255.01 - contrast);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
  return imageData;
}
