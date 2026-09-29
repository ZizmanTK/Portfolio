# Abdoul Aziz Maazou — Portfolio

**Live:** https://zizmantk.github.io/Portfolio/ · 🇫🇷 https://zizmantk.github.io/Portfolio/fr/

Personal portfolio: a bilingual (EN/FR), light/dark Angular 20 site prerendered to static HTML,
with a downloadable one-page PDF resume generated from the same content.

## Editing content

Everything — profile, experience, education, projects, skills, interests — lives in one file:

```
src/content/site.json
```

Every user-facing string is `{ "en": "...", "fr": "..." }`. Interface labels (nav, buttons) are in
`src/app/core/ui-strings.ts`. Images live in `src/assets/img/`.

## Commands

| Command            | What it does                                                        |
| ------------------ | ------------------------------------------------------------------- |
| `npm start`        | Dev server at http://localhost:4200                                 |
| `npm run resume`   | Regenerates `src/assets/resume/*.pdf` from `site.json` (needs Chrome or Edge; set `CHROME_PATH` if not found) |
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
src/app/core/                content types, i18n, theme, SEO
src/app/sections/            header, hero, about, experience, projects, skills, interests, contact
src/app/shared/              icons, section heading, scroll-reveal directive
scripts/build-resume.mjs     HTML → PDF resume via headless Chrome
scripts/publish-docs.mjs     copies the build into docs/
```
