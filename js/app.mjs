import {
  addFontFromFile,
  formatText,
  addPaperFromFile
} from './utils/helpers.mjs';
import {
  generateImages,
  downloadAsPDF,
  deleteAll
} from './generate-images.mjs';
import { setInkColor, toggleDrawCanvas } from './utils/draw.mjs';

/** Entry file: wires the page controls to their handlers. */

const pageEl = document.querySelector('.page-a');

const setTextareaStyle = (attrib, v) => (pageEl.style[attrib] = v);

/**
 * Add event listeners here, they will be automatically mapped with addEventListener later
 */
const EVENT_MAP = {
  '#generate-image-form': {
    on: 'submit',
    action: (e) => {
      e.preventDefault();
      generateImages();
    }
  },
  '#handwriting-font': {
    on: 'change',
    action: (e) => {
      document.body.style.setProperty('--handwriting-font', e.target.value);
      // fonts differ a lot in size; switch to the size that matches the others
      const size = e.target.selectedOptions[0].dataset.size;
      const sizeInput = document.querySelector('#font-size');
      if (size && sizeInput.value !== size) {
        sizeInput.value = size;
        sizeInput.dispatchEvent(new Event('change'));
      }
    }
  },
  '#font-size': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 30) {
        alert('Font-size is too big try upto 30');
      } else {
        setTextareaStyle('fontSize', e.target.value + 'pt');
        e.preventDefault();
      }
    }
  },
  '#letter-spacing': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 40) {
        alert('Letter Spacing is too big try a number upto 40');
      } else {
        setTextareaStyle('letterSpacing', e.target.value + 'px');
        e.preventDefault();
      }
    }
  },
  '#word-spacing': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 100) {
        alert('Word Spacing is too big try a number upto hundred');
      } else {
        setTextareaStyle('wordSpacing', e.target.value + 'px');
        e.preventDefault();
      }
    }
  },
  '#top-padding': {
    on: 'change',
    action: (e) => {
      document.querySelector('.page-a .paper-content').style.paddingTop =
        e.target.value + 'px';
    }
  },
  '#font-file': {
    on: 'change',
    action: (e) => addFontFromFile(e.target.files[0])
  },
  '#ink-color': {
    on: 'change',
    action: (e) => {
      document.body.style.setProperty('--ink-color', e.target.value);
      setInkColor(e.target.value);
    }
  },
  '#paper-margin-toggle': {
    on: 'change',
    action: () => {
      if (pageEl.classList.contains('margined')) {
        pageEl.classList.remove('margined');
      } else {
        pageEl.classList.add('margined');
      }
    }
  },
  '#paper-line-toggle': {
    on: 'change',
    action: () => {
      if (pageEl.classList.contains('lines')) {
        pageEl.classList.remove('lines');
      } else {
        pageEl.classList.add('lines');
      }
    }
  },
  '#draw-diagram-button': {
    on: 'click',
    action: () => {
      toggleDrawCanvas();
    }
  },
  '.draw-container .close-button': {
    on: 'click',
    action: () => {
      toggleDrawCanvas();
    }
  },
  '#download-as-pdf-button': {
    on: 'click',
    action: () => {
      downloadAsPDF();
    }
  },
  '#delete-all-button': {
    on: 'click',
    action: () => {
      deleteAll();
    }
  },
  '.page-a .paper-content': {
    on: 'paste',
    action: formatText
  },
  '#paper-file': {
    on: 'change',
    action: (e) => addPaperFromFile(e.target.files[0])
  }
};

for (const eventSelector in EVENT_MAP) {
  document
    .querySelector(eventSelector)
    .addEventListener(
      EVENT_MAP[eventSelector].on,
      EVENT_MAP[eventSelector].action
    );
}

/**
 * This makes toggles, accessible.
 */
document.querySelectorAll('.switch-toggle input').forEach((toggleInput) => {
  toggleInput.addEventListener('change', (e) => {
    if (toggleInput.checked) {
      document.querySelector(
        `label[for="${toggleInput.id}"] .status`
      ).textContent = 'on';
      toggleInput.setAttribute('aria-checked', true);
    } else {
      toggleInput.setAttribute('aria-checked', false);
      document.querySelector(
        `label[for="${toggleInput.id}"] .status`
      ).textContent = 'off';
    }
  });
});

/** Ink swatches drive the (hidden) ink select that the handlers listen to. */
document.querySelectorAll('input[name="ink"]').forEach((swatch) => {
  swatch.addEventListener('change', () => {
    const select = document.querySelector('#ink-color');
    select.value = swatch.value;
    select.dispatchEvent(new Event('change'));
  });
});

/** Show the chosen file's name on its upload button. */
document.querySelectorAll('.btn-file input[type="file"]').forEach((input) => {
  input.addEventListener('change', () => {
    if (input.files[0]) {
      input.parentElement.querySelector('[data-file-name]').textContent =
        input.files[0].name;
    }
  });
});

/** Help dialog */
const helpDialog = document.querySelector('#help-dialog');
document
  .querySelectorAll('[data-open-help]')
  .forEach((button) =>
    button.addEventListener('click', () => helpDialog.showModal())
  );
document
  .querySelector('[data-close-help]')
  .addEventListener('click', () => helpDialog.close());
helpDialog.addEventListener('click', (e) => {
  if (e.target === helpDialog) helpDialog.close();
});

/** Click a generated page to see it large; arrow keys move between pages. */
const previewDialog = document.querySelector('#preview-dialog');
let previewIndex = 0;
const showPreview = (index) => {
  const pages = [...document.querySelectorAll('#output .page-open img')];
  if (!pages.length) return previewDialog.close();
  previewIndex = (index + pages.length) % pages.length;
  const { src } = pages[previewIndex];
  const n = previewIndex + 1;
  previewDialog.querySelector('#preview-image').src = src;
  previewDialog.querySelector('#preview-image').alt = `Page ${n}`;
  previewDialog.querySelector(
    '#preview-title'
  ).textContent = `Page ${n} of ${pages.length}`;
  const download = previewDialog.querySelector('#preview-download');
  download.href = src;
  download.download = `page-${n}.jpg`;
  if (!previewDialog.open) previewDialog.showModal();
};
document.querySelector('#output').addEventListener('click', (e) => {
  const open = e.target.closest('.page-open');
  if (open) showPreview(Number(open.dataset.index));
});
previewDialog
  .querySelectorAll('[data-preview-step]')
  .forEach((button) =>
    button.addEventListener('click', () =>
      showPreview(previewIndex + Number(button.dataset.previewStep))
    )
  );
previewDialog
  .querySelector('[data-close-preview]')
  .addEventListener('click', () => previewDialog.close());
previewDialog.addEventListener('click', (e) => {
  if (e.target === previewDialog) previewDialog.close();
});
previewDialog.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') showPreview(previewIndex - 1);
  if (e.key === 'ArrowRight') showPreview(previewIndex + 1);
});

/** Show the variation amount next to its slider. */
const variationInput = document.querySelector('#variation');
const showVariation = () =>
  (document.querySelector('#variation-value').textContent =
    variationInput.value);
variationInput.addEventListener('input', showVariation);

/**
 * Remember the inspector settings between visits.
 * Restored values fire their normal change events, so the page updates too.
 */
const SETTINGS_KEY = 'inkwell-settings';
const settingFields = [
  ...document.querySelectorAll(
    '.inspector select:not([hidden]), .inspector input:not([type="file"])'
  )
];
const fieldKey = (field) =>
  field.type === 'radio' ? `${field.name}:${field.value}` : field.id;
const fieldValue = (field) =>
  field.type === 'checkbox' || field.type === 'radio'
    ? field.checked
    : field.value;

function saveSettings() {
  const settings = {};
  settingFields.forEach(
    (field) => (settings[fieldKey(field)] = fieldValue(field))
  );
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    // storage unavailable (private mode): settings just aren't remembered
  }
}

function restoreSettings() {
  let settings;
  try {
    settings = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  } catch (e) {
    return;
  }
  if (!settings) return;
  settingFields.forEach((field) => {
    const saved = settings[fieldKey(field)];
    if (saved === undefined || saved === fieldValue(field)) return;
    if (field.type === 'radio') {
      if (!saved) return; // only the checked radio needs restoring
      field.checked = true;
    } else if (field.type === 'checkbox') {
      field.checked = saved;
    } else {
      field.value = saved;
      // a saved font that no longer exists leaves the select empty: keep the default
      if (field.tagName === 'SELECT' && field.value !== saved) {
        field.selectedIndex = Math.max(
          0,
          [...field.options].findIndex((o) => o.defaultSelected)
        );
        return;
      }
    }
    field.dispatchEvent(new Event('change'));
  });
  showVariation();
}

restoreSettings();
settingFields.forEach((field) =>
  field.addEventListener('change', saveSettings)
);
