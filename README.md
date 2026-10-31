# Abdoul Aziz Maazou — Portfolio

**Live:** https://zizmantk.github.io/Portfolio/ · 🇫🇷 https://zizmantk.github.io/Portfolio/fr/

Personal portfolio: a bilingual (EN/FR) Angular 20 site prerendered to static HTML, "a walk through a day": ten stops
from first light in Niamey to tonight in Grenoble, drawn and animated as you scroll, with a résumé view and a downloadable
one-page PDF resume generated from the same content.

## Editing content

Everything — profile, experience, education, projects, skills, interests — lives in one file:

```
src/content/site.json
```

Every user-facing string is `{ "en": "...", "fr": "..." }`; wrap keywords in `**double asterisks**` to bold them
(on the site and in the CV). The `day` block holds the page's own framing (the hour of each stop, captions, the
descriptions of the drawings); the CV does not read it. Interface labels (buttons, links) are in
`src/app/core/ui-strings.ts`. The drawings live in `src/assets/art/` (their provenance and licences:
`src/assets/art/PROVENANCE.md`, not published); photos, project images and logos in `src/assets/img/` and
`src/assets/logos/`.

## Commands

| Command            | What it does                                                        |
| ------------------ | ------------------------------------------------------------------- |
| `npm start`        | Dev server at http://localhost:4200                                 |
| `npm run resume`   | Regenerates `src/assets/resume/*.pdf` from `site.json` (needs Chrome or Edge; set `CHROME_PATH` if not found) |
| `npm run icons`    | Regenerates the skill-icon styles from `src/content/skill-icons.json` |
| `npm run build`    | Production build + prerender to `dist/portfolio/browser`            |
| `npm run preview`  | Serves the production build at http://localhost:4300/Portfolio/     |
| `npm run deploy`   | resume → build → copy into `docs/`                                  |

## Publishing

GitHub Pages serves the `docs/` folder of `master`. To publish changes:

```bash
npm run deploy
git add -A && git commit -m "Update portfolio" && git push
```

## Structure

```
src/content/site.json        content for the site and the resume
src/app/core/                content types, i18n, interface strings, SEO
src/app/day/                 the day: one component per stop or set piece (bar, hero, stops, knight, signal,
                             coil, climb, stack, roll, after hours, serve, résumé view, footer)
src/app/day/engine/          the scroll engine: time of day, sky, gold thread; each set piece's *.scene.ts
                             animates its component's markup (browser only, after hydration)
src/styles/                  the page's styles, one partial per section, in cascade order
scripts/build-resume.mjs     HTML → PDF resume via headless Chrome
scripts/build-icon-styles.mjs  skill-icon CSS masks from skill-icons.json
scripts/publish-docs.mjs     copies the build into docs/
```
