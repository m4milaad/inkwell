import Boot from './boot';
import {
  AUTHOR,
  BASE_PATH as base,
  DESCRIPTION,
  FACTS,
  FAQ,
  FEATURES,
  SITE_NAME,
  SITE_URL,
  STEPS,
  SUMMARY
} from './site';

// Structured data, linked by @id so search and AI engines read one connected
// picture: who made it, what it is, how to use it, and direct answers
const url = `${SITE_URL}/`;
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${url}#author`,
      name: AUTHOR.name,
      url: AUTHOR.url,
      sameAs: [AUTHOR.url]
    },
    {
      '@type': 'WebSite',
      '@id': `${url}#website`,
      url,
      name: SITE_NAME,
      inLanguage: 'en',
      publisher: { '@id': `${url}#author` }
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: 'Free text to handwriting converter',
      description: SUMMARY,
      inLanguage: 'en',
      isPartOf: { '@id': `${url}#website` },
      about: { '@id': `${url}#app` },
      dateModified: new Date().toISOString().slice(0, 10),
      // parts a voice assistant can read aloud
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.about h1', '.about-lead']
      }
    },
    {
      '@type': 'WebApplication',
      '@id': `${url}#app`,
      name: SITE_NAME,
      url,
      description: DESCRIPTION,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      inLanguage: 'en',
      isAccessibleForFree: true,
      featureList: FEATURES,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@id': `${url}#author` }
    },
    {
      '@type': 'HowTo',
      '@id': `${url}#howto`,
      name: 'How to convert text to handwriting',
      totalTime: 'PT1M',
      tool: { '@type': 'HowToTool', name: SITE_NAME },
      step: STEPS.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text
      }))
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: FAQ.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      }))
    }
  ]
};

export default function Page() {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="i-download" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m7 10 5 5 5-5" />
          <path d="M12 15V3" />
        </symbol>
        <symbol id="i-upload" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m17 8-5-5-5 5" />
          <path d="M12 3v12" />
        </symbol>
        <symbol id="i-trash" viewBox="0 0 24 24">
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </symbol>
        <symbol id="i-pencil" viewBox="0 0 24 24">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </symbol>
        <symbol id="i-help" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </symbol>
        <symbol id="i-sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </symbol>
        <symbol id="i-moon" viewBox="0 0 24 24">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </symbol>
        <symbol id="i-left" viewBox="0 0 24 24">
          <path d="m15 18-6-6 6-6" />
        </symbol>
        <symbol id="i-right" viewBox="0 0 24 24">
          <path d="m9 18 6-6-6-6" />
        </symbol>
        <symbol id="i-x" viewBox="0 0 24 24">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </symbol>
        <symbol id="i-pages" viewBox="0 0 24 24">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 13H8m8 4H8m8-8H8" />
        </symbol>
      </svg>
      <header className="topbar">
        <a className="brand" href={`${base}/`}>
          <img src={`${base}/images/icon.svg`} alt="" width="20" height="20" />
          Inkwell
        </a>
        <div className="topbar-actions">
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            data-open-help=""
            aria-label="Help"
            title="Help"
          >
            <svg className="icon">
              <use href="#i-help" />
            </svg>
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-icon dark-mode-toggle"
            aria-label="Activate Dark Mode"
            title="Toggle dark mode"
            aria-pressed="false"
          >
            <svg className="icon sun">
              <use href="#i-sun" />
            </svg>
            <svg className="icon moon">
              <use href="#i-moon" />
            </svg>
          </button>
          <span className="topbar-divider" aria-hidden="true"></span>
          <button
            type="submit"
            form="generate-image-form"
            data-testid="generate-image-button"
            className="btn btn-primary generate-image-button"
          >
            Generate pages
          </button>
        </div>
      </header>

      <main>
        <form id="generate-image-form" className="workspace">
          {/* Canvas: the live page and the generated pages */}
          <div className="canvas">
            <section className="stage page-container-super" aria-label="Page">
              <div className="page-container">
                <div className="page-a margined lines">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="top-margin"
                  ></div>
                  <div className="display-flex left-margin-and-content">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="left-margin"
                    ></div>
                    <div
                      className="paper-content"
                      id="note"
                      contentEditable
                      suppressContentEditableWarning
                      aria-label="Page text"
                    >
                      Paste your notes here. Headings, bold text, lists and
                      tables pasted as markdown are written out by hand, and
                      long text flows onto as many pages as it needs.
                    </div>
                  </div>
                  <div className="overlay"></div>
                </div>
              </div>
              <div className="stage-bar">
                <p className="stage-caption">Type or paste text and markdown</p>
                <button
                  id="draw-diagram-button"
                  type="button"
                  className="btn btn-ghost draw-button"
                >
                  <svg className="icon">
                    <use href="#i-pencil" />
                  </svg>
                  Draw a diagram
                </button>
              </div>
            </section>

            <section className="tray" aria-labelledby="output-header">
              <div className="tray-head">
                <h2 id="output-header">Pages</h2>
                <div className="tray-actions">
                  <button
                    type="button"
                    className="btn btn-ghost delete-button"
                    id="delete-all-button"
                  >
                    <svg className="icon">
                      <use href="#i-trash" />
                    </svg>
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    id="download-as-pdf-button"
                  >
                    <svg className="icon">
                      <use href="#i-download" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
              <div id="output" className="output">
                Your generated pages will appear here.
              </div>
            </section>
          </div>

          {/* Inspector */}
          <aside
            className="inspector customization-col"
            aria-label="Page settings"
          >
            <fieldset>
              <legend>Handwriting</legend>
              <div className="row">
                <label htmlFor="handwriting-font">Font</label>
                <select
                  id="handwriting-font"
                  defaultValue="'Homemade Apple', cursive"
                >
                  <optgroup label="Everyday print">
                    <option
                      data-size="11"
                      value="'The Girl Next Door', cursive"
                      style={{ fontFamily: "'The Girl Next Door', cursive" }}
                    >
                      The Girl Next Door
                    </option>
                    <option
                      data-size="9.5"
                      value="'Shadows Into Light Two', cursive"
                      style={{
                        fontFamily: "'Shadows Into Light Two', cursive"
                      }}
                    >
                      Shadows Into Light Two
                    </option>
                    <option
                      data-size="12"
                      value="'Annie Use Your Telescope', cursive"
                      style={{
                        fontFamily: "'Annie Use Your Telescope', cursive"
                      }}
                    >
                      Annie Use Your Telescope
                    </option>
                    <option
                      data-size="11.5"
                      value="'Waiting for the Sunrise', cursive"
                      style={{
                        fontFamily: "'Waiting for the Sunrise', cursive"
                      }}
                    >
                      Waiting for the Sunrise
                    </option>
                    <option
                      data-size="14.5"
                      value="'Reenie Beanie', cursive"
                      style={{ fontFamily: "'Reenie Beanie', cursive" }}
                    >
                      Reenie Beanie
                    </option>
                    <option
                      data-size="14"
                      value="'Grape Nuts', cursive"
                      style={{ fontFamily: "'Grape Nuts', cursive" }}
                    >
                      Grape Nuts
                    </option>
                    <option
                      data-size="13"
                      value="'Just Another Hand', cursive"
                      style={{ fontFamily: "'Just Another Hand', cursive" }}
                    >
                      Just Another Hand
                    </option>
                    <option
                      data-size="11"
                      value="'Loved by the King', cursive"
                      style={{ fontFamily: "'Loved by the King', cursive" }}
                    >
                      Loved by the King
                    </option>
                    <option
                      data-size="15"
                      value="'Caveat', cursive"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      Caveat
                    </option>
                    <option
                      data-size="12"
                      value="'Shadows Into Light', cursive"
                      style={{ fontFamily: "'Shadows Into Light', cursive" }}
                    >
                      Shadows Into Light
                    </option>
                    <option
                      data-size="15"
                      value="'Sue Ellen Francisco', cursive"
                      style={{ fontFamily: "'Sue Ellen Francisco', cursive" }}
                    >
                      Sue Ellen Francisco
                    </option>
                    <option
                      data-size="17"
                      value="'Square Peg', cursive"
                      style={{ fontFamily: "'Square Peg', cursive" }}
                    >
                      Square Peg
                    </option>
                  </optgroup>
                  <optgroup label="Cursive">
                    <option
                      data-size="10"
                      value="'Homemade Apple', cursive"
                      style={{ fontFamily: "'Homemade Apple', cursive" }}
                    >
                      Homemade Apple
                    </option>
                    <option
                      data-size="11"
                      value="'Nothing You Could Do', cursive"
                      style={{ fontFamily: "'Nothing You Could Do', cursive" }}
                    >
                      Nothing You Could Do
                    </option>
                    <option
                      data-size="16"
                      value="'Dawning of a New Day', cursive"
                      style={{ fontFamily: "'Dawning of a New Day', cursive" }}
                    >
                      Dawning of a New Day
                    </option>
                    <option
                      data-size="14"
                      value="'Cedarville Cursive', cursive"
                      style={{ fontFamily: "'Cedarville Cursive', cursive" }}
                    >
                      Cedarville Cursive
                    </option>
                    <option
                      data-size="13"
                      value="'La Belle Aurore', cursive"
                      style={{ fontFamily: "'La Belle Aurore', cursive" }}
                    >
                      La Belle Aurore
                    </option>
                    <option
                      data-size="14.5"
                      value="'Zeyada', cursive"
                      style={{ fontFamily: "'Zeyada', cursive" }}
                    >
                      Zeyada
                    </option>
                    <option
                      data-size="15.5"
                      value="'Ms Madi', cursive"
                      style={{ fontFamily: "'Ms Madi', cursive" }}
                    >
                      Ms Madi
                    </option>
                    <option
                      data-size="15.5"
                      value="'Oooh Baby', cursive"
                      style={{ fontFamily: "'Oooh Baby', cursive" }}
                    >
                      Oooh Baby
                    </option>
                  </optgroup>
                  <optgroup label="School cursive">
                    <option
                      data-size="11.5"
                      value="'Playwrite IN', cursive"
                      style={{ fontFamily: "'Playwrite IN', cursive" }}
                    >
                      Playwrite IN
                    </option>
                  </optgroup>
                  <optgroup label="Other scripts">
                    <option
                      data-size="11.5"
                      value="'Kalam', cursive"
                      style={{ fontFamily: "'Kalam', cursive" }}
                    >
                      Kalam (Hindi)
                    </option>
                    <option
                      data-size="14"
                      value="'Nanum Pen Script', cursive"
                      style={{ fontFamily: "'Nanum Pen Script', cursive" }}
                    >
                      Nanum Pen (Korean)
                    </option>
                    <option
                      data-size="12"
                      value="'Ma Shan Zheng', cursive"
                      style={{ fontFamily: "'Ma Shan Zheng', cursive" }}
                    >
                      Ma Shan Zheng (Chinese)
                    </option>
                    <option
                      data-size="12"
                      value="'Liu Jian Mao Cao', cursive"
                      style={{ fontFamily: "'Liu Jian Mao Cao', cursive" }}
                    >
                      Liu Jian Mao Cao (Chinese)
                    </option>
                  </optgroup>
                </select>
              </div>
              <div className="row">
                <span className="row-label" id="ink-label">
                  Ink
                </span>
                <div
                  className="swatches"
                  role="radiogroup"
                  aria-labelledby="ink-label"
                >
                  <label className="swatch" title="Blue">
                    <input
                      type="radio"
                      name="ink"
                      value="#000f55"
                      defaultChecked
                    />
                    <span style={{ background: '#000f55' }}></span>
                    <span className="visually-hidden">Blue</span>
                  </label>
                  <label className="swatch" title="Black">
                    <input type="radio" name="ink" value="black" />
                    <span style={{ background: '#1a1a1a' }}></span>
                    <span className="visually-hidden">Black</span>
                  </label>
                  <label className="swatch" title="Red">
                    <input type="radio" name="ink" value="#ba3807" />
                    <span style={{ background: '#ba3807' }}></span>
                    <span className="visually-hidden">Red</span>
                  </label>
                  <label className="swatch" title="Green">
                    <input type="radio" name="ink" value="#1d5c3a" />
                    <span style={{ background: '#1d5c3a' }}></span>
                    <span className="visually-hidden">Green</span>
                  </label>
                  <label className="swatch" title="Pencil">
                    <input type="radio" name="ink" value="#5d5f63" />
                    <span style={{ background: '#5d5f63' }}></span>
                    <span className="visually-hidden">Pencil</span>
                  </label>
                </div>
                <select id="ink-color" hidden aria-hidden="true" tabIndex="-1">
                  <option value="#000f55">Blue</option>
                  <option value="black">Black</option>
                  <option value="#ba3807">Red</option>
                  <option value="#1d5c3a">Green</option>
                  <option value="#5d5f63">Pencil</option>
                </select>
              </div>
              <div className="row">
                <label htmlFor="font-size">Size</label>
                <div className="unit-input" data-unit="pt">
                  <input
                    id="font-size"
                    min="0"
                    step="0.5"
                    defaultValue="10"
                    type="number"
                  />
                </div>
              </div>
              <div className="row">
                <label htmlFor="variation">Variation</label>
                <div className="range-input">
                  <input
                    id="variation"
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="40"
                  />
                  <output htmlFor="variation" id="variation-value">
                    40
                  </output>
                </div>
              </div>
              <div className="row">
                <span className="row-label">Own font</span>
                <label className="btn btn-secondary btn-file">
                  <svg className="icon">
                    <use href="#i-upload" />
                  </svg>
                  <span data-file-name="">Upload .ttf</span>
                  <input
                    accept=".ttf, .otf"
                    type="file"
                    id="font-file"
                    className="visually-hidden"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>Spacing</legend>
              <div className="row">
                <label htmlFor="top-padding">Top offset</label>
                <div className="unit-input" data-unit="px">
                  <input
                    id="top-padding"
                    min="0"
                    defaultValue="5"
                    type="number"
                  />
                </div>
              </div>
              <div className="row">
                <label htmlFor="word-spacing">Word spacing</label>
                <div className="unit-input" data-unit="px">
                  <input
                    id="word-spacing"
                    min="0"
                    max="100"
                    defaultValue="0"
                    type="number"
                  />
                </div>
              </div>
              <div className="row">
                <label htmlFor="letter-spacing">Letter spacing</label>
                <div className="unit-input" data-unit="pt">
                  <input
                    id="letter-spacing"
                    min="-5"
                    max="40"
                    defaultValue="0"
                    type="number"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Paper</legend>
              <div className="row">
                <label htmlFor="paper-margin-toggle">
                  Margin
                  <span aria-label="paper margin status" className="status">
                    on
                  </span>
                </label>
                <label className="switch-toggle outer">
                  <input
                    aria-checked="true"
                    defaultChecked
                    aria-label="Paper margin"
                    id="paper-margin-toggle"
                    type="checkbox"
                  />
                  <div></div>
                </label>
              </div>
              <div className="row">
                <label htmlFor="paper-line-toggle">
                  Ruled lines
                  <span aria-label="paper line status" className="status">
                    on
                  </span>
                </label>
                <label className="switch-toggle outer">
                  <input
                    aria-checked="true"
                    defaultChecked
                    aria-label="Ruled lines"
                    id="paper-line-toggle"
                    type="checkbox"
                  />
                  <div></div>
                </label>
              </div>
              <div className="row">
                <label htmlFor="page-size">Size</label>
                <select id="page-size">
                  <option value="a4">A4</option>
                </select>
              </div>
              <div className="row">
                <label htmlFor="page-effects">Lighting</label>
                <select id="page-effects">
                  <option value="shadows">Shadows</option>
                  <option value="scanner">Scanner</option>
                  <option value="no-effect">None</option>
                </select>
              </div>
              <div className="row">
                <span className="row-label">Background</span>
                <label className="btn btn-secondary btn-file">
                  <svg className="icon">
                    <use href="#i-upload" />
                  </svg>
                  <span data-file-name="">Paper photo</span>
                  <input
                    accept=".jpg, .jpeg, .png"
                    type="file"
                    id="paper-file"
                    className="visually-hidden"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>Export</legend>
              <div className="row">
                <label htmlFor="resolution">Quality</label>
                <select id="resolution" defaultValue="2">
                  <option value="0.8">Draft</option>
                  <option value="1">Low</option>
                  <option value="2">Standard</option>
                  <option value="3">High</option>
                  <option value="4">Print</option>
                </select>
              </div>
              <p className="inspector-note">
                Lighting and quality apply to the generated pages, not the
                preview
              </p>
            </fieldset>
          </aside>
        </form>
      </main>
      <article className="about">
        <h1>Free text to handwriting converter</h1>
        <p className="about-lead">{SUMMARY}</p>

        <h2>Inkwell at a glance</h2>
        <dl className="facts">
          {FACTS.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <h2>How to convert text to handwriting</h2>
        <ol>
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <h2>Why it looks real</h2>
        <ul>
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <h2>Frequently asked questions</h2>
        {FAQ.map(({ q, a }) => (
          <section key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </section>
        ))}
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <footer className="footer">
        <span>© 2026 Inkwell</span>
        <span>
          Developed by{' '}
          <a
            href="https://m4milaad.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Milad
          </a>
        </span>
      </footer>

      {/* Help */}
      <dialog
        className="help-dialog"
        id="help-dialog"
        aria-labelledby="help-title"
      >
        <div className="dialog-head">
          <h2 id="help-title">Help</h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            data-close-help=""
            aria-label="Close help"
          >
            <svg className="icon">
              <use href="#i-x" />
            </svg>
          </button>
        </div>
        <div className="dialog-body" id="faq">
          <section id="how-to-add-handwriting">
            <h3>Write in your own handwriting</h3>
            <ol>
              <li>
                Make a font from a sample of your writing, for example with
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.calligraphr.com/en/"
                >
                  Calligraphr
                </a>
              </li>
              <li>Download it as a .ttf or .otf file</li>
              <li>Upload it under Handwriting, Own font</li>
            </ol>
          </section>
          <section>
            <h3>Make it look less like a font</h3>
            <p>
              Variation gives every word a slightly different height, tilt, size
              and ink pressure in the generated pages, the way real writing
              drifts. Around 40 looks natural; 0 turns it off.
            </p>
          </section>
          <section>
            <h3>Markdown you can paste</h3>
            <p>
              Headings, <code>**bold**</code>, <code>*italic*</code>,
              <code>~~strikethrough~~</code>, lists, checklists, quotes, code
              blocks and tables. Tables are drawn as a ruled grid and are never
              split across pages.
            </p>
          </section>
          <section>
            <h3>Gaps between letters in a custom font</h3>
            <p>
              Some uploaded fonts leave gaps. Adjust letter and word spacing
              until the writing looks joined up.
            </p>
          </section>
          <section>
            <h3>More handwriting fonts</h3>
            <p>
              Any handwriting font in .ttf or .otf format works, for example
              from
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.quantumenterprises.co.uk/handwriting-fonts/fontvault.htm"
              >
                Font Vault
              </a>
              .
            </p>
          </section>
          <p className="dialog-foot">
            Inkwell runs in your browser. Your text never leaves your device.
            <br />
            Developed by{' '}
            <a
              href="https://m4milaad.github.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Milad
            </a>
            .
            <br />© 2026 Inkwell. Released under the MIT License.
          </p>
        </div>
      </dialog>

      {/* Draw popup */}
      <section
        className="draw-container popup-container"
        aria-label="Draw a diagram"
      >
        <header className="topbar">
          <span className="brand">Draw a diagram</span>
          <div className="topbar-actions">
            <button
              id="clear-draw-canvas"
              type="button"
              className="btn btn-ghost"
            >
              <svg className="icon">
                <use href="#i-trash" />
              </svg>
              Clear
            </button>
            <button
              id="add-new-image-button"
              type="button"
              className="btn btn-ghost"
            >
              <svg className="icon">
                <use href="#i-upload" />
              </svg>
              Background image
            </button>
            <button
              id="draw-download-button"
              type="button"
              className="btn btn-ghost"
            >
              <svg className="icon">
                <use href="#i-download" />
              </svg>
              Download
            </button>
            <button
              id="add-to-paper-button"
              type="button"
              className="btn btn-primary"
            >
              Add to page
            </button>
            <span className="topbar-divider" aria-hidden="true"></span>
            <button
              type="button"
              className="btn btn-ghost btn-icon close-button"
              aria-label="Close drawing"
            >
              <svg className="icon">
                <use href="#i-x" />
              </svg>
            </button>
          </div>
        </header>
        <div className="draw-stage">
          <canvas id="diagram-canvas" height="300px" width="600px"></canvas>
        </div>
        <input
          type="file"
          id="image-to-add-in-canvas"
          accept="image/x-png,image/jpeg"
          hidden
        />
      </section>
      <Boot />
    </>
  );
}
