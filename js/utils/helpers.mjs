const pageEl = document.querySelector('.page-a');
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function addFontFromFile(fileObj) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const newFont = new FontFace('temp-font', e.target.result);
    newFont.load().then((loadedFace) => {
      document.fonts.add(loadedFace);
      pageEl.style.fontFamily = 'temp-font';
    });
  };
  reader.readAsArrayBuffer(fileObj);
}

/**
 * @method createPDF
 * @param imgs array of images (in base64)
 * @description
 * Creates PDF from list of given images
 */
function createPDF(imgs) {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF('p', 'pt', 'a4');
  const width = doc.internal.pageSize.width;
  const height = doc.internal.pageSize.height;
  for (const i in imgs) {
    doc.text(10, 20, '');
    doc.addImage(
      imgs[i],
      'JPEG',
      25,
      50,
      width - 50,
      height - 80,
      'image-' + i
    );
    if (i != imgs.length - 1) {
      doc.addPage();
    }
  }
  doc.save();
}

// inline markdown: links, code, bold, italic, strike
const inlineMarkdown = (s) =>
  s
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*\*(?=\S)(.+?)(?<=\S)\*\*\*/g, '<b><i>$1</i></b>')
    .replace(/(\*\*|__)(?=\S)(.+?)(?<=\S)\1/g, '<b>$2</b>')
    .replace(/(^|[^\w*])\*(?=\S)([^*]+?)(?<=\S)\*(?!\*)/g, '$1<i>$2</i>')
    .replace(/(^|\W)_(?=\S)([^_]+?)(?<=\S)_(?!\w)/g, '$1<i>$2</i>')
    .replace(/~~(?=\S)(.+?)(?<=\S)~~/g, '<s>$1</s>');

const isTableRow = (line) => /^\s*\|.*\|\s*$/.test(line);
const isTableSeparator = (line) =>
  /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(line);
const tableCells = (line) =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());

/** Builds a <table> from markdown table lines. Numbers are right-aligned. */
function markdownTable(lines) {
  const hasHeader = lines.length > 1 && isTableSeparator(lines[1]);
  const aligns = hasHeader
    ? tableCells(lines[1]).map((c) =>
        c.endsWith(':') ? (c.startsWith(':') ? 'center' : 'right') : ''
      )
    : [];
  const rows = lines
    .filter((line) => !isTableSeparator(line))
    .map((line, rowIndex) => {
      const tag = hasHeader && rowIndex === 0 ? 'th' : 'td';
      const cells = tableCells(line).map((cell, i) => {
        const align =
          aligns[i] || (/^[-+]?[\d.,]+%?$/.test(cell) ? 'right' : '');
        const style = align ? ` style="text-align: ${align}"` : '';
        return `<${tag}${style}>${inlineMarkdown(cell)}</${tag}>`;
      });
      return `<tr>${cells.join('')}</tr>`;
    });
  return `<table>${rows.join('')}</table>`;
}

/**
 * Converts markdown (headings, bold, italic, strike, code, lists, tables,
 * quotes, links, checklists) to HTML for the page.
 * Inline formatting uses attribute-less tags so page splitting can carry it over.
 */
function markdownToHTML(text) {
  const lines = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .split('\n');
  const out = [];
  let inCode = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inCode = !inCode;
    } else if (inCode) {
      // code is written as-is, keeping its indentation
      out.push(line.replace(/^ +/, (s) => '&nbsp;'.repeat(s.length)));
    } else if (isTableRow(line)) {
      const start = i;
      while (i + 1 < lines.length && isTableRow(lines[i + 1])) i++;
      out.push(markdownTable(lines.slice(start, i + 1)));
    } else if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      out.push(''); // horizontal rule
    } else {
      out.push(
        inlineMarkdown(
          line
            // headings stay on one ruled line: bold + underlined, not bigger
            .replace(/^#{1,6}\s+(.*)$/, '<b><u>$1</u></b>')
            .replace(/^&gt;\s?(.*)$/, '<i>$1</i>')
            .replace(/^(\s*)[-*+]\s+\[x\]/i, '$1☑')
            .replace(/^(\s*)[-*+]\s+\[ \]/, '$1☐')
        )
      );
    }
  }
  // a table is already its own block, so no line break after it
  return out.join('<br/>').replace(/<\/table><br\/>/g, '</table>');
}

function formatText(event) {
  event.preventDefault();
  const text = markdownToHTML(event.clipboardData.getData('text/plain'));
  document.execCommand('insertHTML', false, text);
}

function addPaperFromFile(file) {
  const tmppath = URL.createObjectURL(file);
  pageEl.style.backgroundImage = `url(${tmppath})`;
}

export {
  isMobile,
  addFontFromFile,
  createPDF,
  formatText,
  markdownToHTML,
  addPaperFromFile
};
