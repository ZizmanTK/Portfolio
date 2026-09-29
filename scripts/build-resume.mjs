/**
 * Builds the downloadable resume PDFs (EN + FR) from src/content/site.json,
 * the same file the website renders — so the two never drift apart.
 *
 *   npm run resume            → src/assets/resume/*.pdf
 *   CHROME_PATH=... npm run resume   (if Chrome/Edge isn't found automatically)
 *
 * Also writes the HTML next to the PDFs' temp dir for debugging (--keep-html).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(join(root, 'src/content/site.json'), 'utf8'));
const outDir = join(root, 'src/assets/resume');
const keepHtml = process.argv.includes('--keep-html');

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('Chrome/Edge not found. Set CHROME_PATH to a Chromium-based browser executable.');
  process.exit(1);
}

const LABELS = {
  en: {
    file: site.profile.resume.en,
    summary: 'Profile',
    experience: 'Experience',
    projects: 'Selected projects',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    interests: 'Interests',
    present: 'Present',
    photo: false,
  },
  fr: {
    file: site.profile.resume.fr,
    summary: 'Profil',
    experience: 'Expérience professionnelle',
    projects: 'Projets personnels',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    interests: 'Centres d’intérêt',
    present: 'Aujourd’hui',
    photo: true, // photos are customary on French CVs
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function month(ym, lang) {
  if (!ym) return LABELS[lang].present;
  const [y, m] = ym.split('-').map(Number);
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

function render(lang) {
  const L = LABELS[lang];
  const t = (v) => esc(v[lang]);
  const p = site.profile;
  const avatar = pathToFileURL(join(root, 'src', p.avatar)).href;
  const linkedin = site.socials.find((s) => s.id === 'linkedin');
  const github = site.socials.find((s) => s.id === 'github');
  const personal = site.projects.filter((pr) => !pr.featured);

  const contact = [
    `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`,
    esc(p.location[lang]),
    `<a href="${esc(p.site)}">${esc(stripProtocol(p.site))}</a>`,
    `<a href="${esc(linkedin.url)}">${esc(stripProtocol(linkedin.url))}</a>`,
    `<a href="${esc(github.url)}">${esc(stripProtocol(github.url))}</a>`,
  ];

  const experience = site.experience
    .map(
      (e) => `
      <article class="item">
        <header>
          <div>
            <h3>${t(e.role)} <span class="at">· ${esc(e.company)}</span></h3>
            <p class="meta">${t(e.type)} · ${esc(e.location)}</p>
          </div>
          <p class="dates">${esc(month(e.start, lang))} – ${esc(month(e.end, lang))}</p>
        </header>
        <ul>${e.highlights.map((h) => `<li>${t(h)}</li>`).join('')}</ul>
        <p class="stack">${e.stack.map(esc).join(' · ')}</p>
      </article>`,
    )
    .join('');

  const projects = personal
    .map(
      (pr) => `
      <article class="item item--compact">
        <header>
          <h3>${esc(pr.name)} <span class="at">· ${t(pr.context)}</span></h3>
          <p class="dates">${esc(pr.year)}</p>
        </header>
        <p>${t(pr.tagline)} <span class="stack-inline">${pr.stack.map(esc).join(' · ')}</span></p>
      </article>`,
    )
    .join('');

  const education = site.education
    .map(
      (e) => `
      <article class="side-item">
        <h3>${t(e.degree)}</h3>
        <p>${esc(e.school.includes(e.location.split(',')[0]) ? e.school : `${e.school}, ${e.location.split(',')[0]}`)}</p>
        <p class="dates">${esc(month(e.start, lang))} – ${esc(month(e.end, lang))}</p>
      </article>`,
    )
    .join('');

  const skills = site.skills
    .map((g) => `<div class="skill-group"><h3>${t(g.group)}</h3><p>${g.items.map((s) => esc(s.name)).join(', ')}</p></div>`)
    .join('');

  const languages = site.languages.map((l) => `<li><span>${t(l.name)}</span><span class="muted">${t(l.level)}</span></li>`).join('');
  const interests = site.interests.map((i) => t(i.name)).join(' · ');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(p.name)} — ${t(p.role)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Instrument+Serif&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { width: 210mm; font-family: 'Geist', system-ui, sans-serif; font-size: 8.9pt; line-height: 1.42; color: #1b1a17; background: #fff; }
  a { color: inherit; text-decoration: none; }
  .page { display: grid; grid-template-columns: 1fr 62mm; min-height: 296mm; }
  main { padding: 11.5mm 9mm 8mm 14mm; }
  aside { padding: 11.5mm 11mm 8mm 8mm; background: #f5f3ee; border-left: 1px solid #e6e2d8; }

  .top { display: flex; align-items: center; gap: 5mm; }
  .avatar { width: 23mm; height: 23mm; border-radius: 50%; object-fit: cover; }
  h1 { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; font-size: 30pt; line-height: 0.95; letter-spacing: -0.01em; }
  h1 em { font-style: italic; }
  h1 .dot { color: #e5461a; }
  .role { margin-top: 2.2mm; font-size: 8pt; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #b5340c; }
  .contact { margin-top: 3.4mm; display: flex; flex-wrap: wrap; gap: 1mm 3.2mm; font-size: 8pt; color: #4a4843; }
  .contact span + span::before { content: ''; }

  h2 { display: flex; align-items: center; gap: 2.5mm; margin: 4.8mm 0 2.3mm; font-size: 7.6pt; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #6b6860; }
  h2::after { content: ''; flex: 1; height: 1px; background: #e2ded4; }
  aside h2 { margin-top: 0; }
  aside section + section h2 { margin-top: 5.5mm; }

  .summary { font-size: 9.2pt; color: #33312c; }

  .item + .item { margin-top: 3.1mm; }
  .item header { display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; }
  .item h3 { font-size: 9.8pt; font-weight: 600; letter-spacing: -0.01em; }
  .item .at { font-weight: 500; color: #4a4843; }
  .meta { font-size: 8pt; color: #6b6860; }
  .dates { flex-shrink: 0; font-size: 8pt; font-weight: 500; color: #6b6860; font-variant-numeric: tabular-nums; }
  .item ul { margin: 1.4mm 0 0 0; list-style: none; }
  .item li { position: relative; padding-left: 3.2mm; color: #33312c; }
  .item li + li { margin-top: 0.7mm; }
  .item li::before { content: ''; position: absolute; left: 0; top: 0.68em; width: 1.6mm; height: 0.35mm; background: #e5461a; }
  .stack { margin-top: 1.3mm; font-size: 7.7pt; color: #8a867c; }
  .item--compact + .item--compact { margin-top: 2.2mm; }
  .item--compact p { color: #33312c; }
  .stack-inline { font-size: 7.7pt; color: #8a867c; margin-left: 1mm; }

  .side-item + .side-item { margin-top: 3mm; }
  .side-item h3 { font-size: 8.9pt; font-weight: 600; line-height: 1.3; }
  .side-item p { color: #4a4843; }
  .side-item .dates { margin-top: 0.3mm; }
  .skill-group + .skill-group { margin-top: 2.4mm; }
  .skill-group h3 { font-size: 8pt; font-weight: 600; }
  .skill-group p { color: #4a4843; }
  .langs { list-style: none; }
  .langs li { display: flex; justify-content: space-between; padding: 0.9mm 0; border-bottom: 1px solid #e6e2d8; }
  .langs li:last-child { border-bottom: 0; }
  .muted { color: #6b6860; }
  .interests { color: #4a4843; }
</style>
</head>
<body>
<div class="page">
  <main>
    <div class="top">
      ${L.photo ? `<img class="avatar" src="${avatar}" alt="">` : ''}
      <div>
        <h1>${esc(p.firstName)} <em>${esc(p.lastName)}</em><span class="dot">.</span></h1>
        <p class="role">${t(p.role)}</p>
      </div>
    </div>
    <p class="contact">${contact.map((c) => `<span>${c}</span>`).join('')}</p>

    <h2>${L.summary}</h2>
    <p class="summary">${t(p.summary)}</p>

    <h2>${L.experience}</h2>
    ${experience}

    <h2>${L.projects}</h2>
    ${projects}
  </main>

  <aside>
    <section>
      <h2>${L.skills}</h2>
      ${skills}
    </section>
    <section>
      <h2>${L.education}</h2>
      ${education}
    </section>
    <section>
      <h2>${L.languages}</h2>
      <ul class="langs">${languages}</ul>
    </section>
    <section>
      <h2>${L.interests}</h2>
      <p class="interests">${interests}</p>
    </section>
  </aside>
</div>
</body>
</html>`;
}

mkdirSync(outDir, { recursive: true });
const work = mkdtempSync(join(tmpdir(), 'resume-'));

for (const lang of ['en', 'fr']) {
  const html = join(work, `resume-${lang}.html`);
  writeFileSync(html, render(lang));
  const pdf = join(root, 'src', LABELS[lang].file);
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=10000',
    `--print-to-pdf=${pdf}`,
    pathToFileURL(html).href,
  ], { stdio: 'ignore' });

  const pages = (readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`✔ ${LABELS[lang].file}  (${Math.round(statSync(pdf).size / 1024)} KB, ${pages} page${pages === 1 ? '' : 's'})`);
  if (pages !== 1) console.warn(`  ⚠ ${lang} resume spans ${pages} pages — tighten the content or styles.`);
  if (keepHtml) console.log(`  html: ${html}`);
}

if (!keepHtml) rmSync(work, { recursive: true, force: true });
