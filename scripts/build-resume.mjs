/**
 * Builds the downloadable resume PDFs (EN + FR) from src/content/site.json,
 * the same file the website renders — so the two never drift apart.
 *
 *   npm run resume                       → src/assets/resume/*.pdf (crown logo)
 *   npm run resume -- --logo=ligature    → use another mark (crown | ligature | tetromino | detection)
 *   npm run resume -- --keep-html        → keep the intermediate HTML for debugging
 *   CHROME_PATH=... npm run resume       → if Chrome/Edge isn't found automatically
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
const logoArg = process.argv.find((a) => a.startsWith('--logo='))?.split('=')[1] ?? 'crown';
const logoFile = join(root, `src/assets/img/mark-${logoArg}.svg`);
if (!existsSync(logoFile)) {
  console.error(`Unknown logo "${logoArg}" (expected crown, ligature, tetromino or detection).`);
  process.exit(1);
}

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
    summary: 'profile',
    experience: 'experience',
    projects: 'side projects',
    education: 'education',
    stack: 'stack',
    languages: 'languages',
    interests: 'off the clock',
    present: 'present',
    photo: false,
  },
  fr: {
    file: site.profile.resume.fr,
    summary: 'profil',
    experience: 'expérience',
    projects: 'projets perso',
    education: 'formation',
    stack: 'stack',
    languages: 'langues',
    interests: 'hors du bureau',
    present: 'aujourd’hui',
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

/** Same short hash as the site's timeline (src/app/core/content.ts → shortHash). */
function shortHash(input) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

function render(lang) {
  const L = LABELS[lang];
  const t = (v) => esc(v[lang]);
  const p = site.profile;
  const avatar = pathToFileURL(join(root, 'src', p.avatar)).href;
  const logo = pathToFileURL(logoFile).href;
  const linkedin = site.socials.find((s) => s.id === 'linkedin');
  const github = site.socials.find((s) => s.id === 'github');
  const itch = site.socials.find((s) => s.id === 'itch');
  const sideProjects = site.projects.filter((pr) => pr.category === 'games');

  const contact = [
    `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`,
    esc(p.location[lang]),
    `<a href="${esc(linkedin.url)}">${esc(stripProtocol(linkedin.url))}</a>`,
    `<a href="${esc(github.url)}">${esc(stripProtocol(github.url))}</a>`,
    `<a href="${esc(p.site)}">${esc(stripProtocol(p.site))}</a>`,
  ];

  const experience = site.experience
    .map(
      (e, i) => `
      <article class="commit${i === 0 ? ' commit--head' : ''}">
        <p class="commit__meta"><span class="hash">${shortHash(e.company + e.start)}</span> ${esc(month(e.start, lang))} → ${esc(month(e.end, lang))}
          <span class="ref">${t(e.type)}</span></p>
        <h3>${t(e.role)} <span class="at">@ ${esc(e.company)}</span> <span class="where">· ${t(e.location)}</span></h3>
        <ul>${e.highlights.map((h) => `<li>${t(h)}</li>`).join('')}</ul>
        <p class="stack">${e.stack.map(esc).join(' · ')}</p>
      </article>`,
    )
    .join('');

  const projects = sideProjects
    .map(
      (pr) => `
      <p class="side-proj"><b>${esc(pr.name)}</b> <span class="muted">· ${pr.year && !pr.context[lang].includes(pr.year) ? `${t(pr.context)} · ${esc(pr.year)}` : t(pr.context)}</span> — ${t(pr.tagline)}</p>`,
    )
    .join('');

  const education = site.education
    .map(
      (e) => `
      <article class="edu">
        <p class="edu__dates">${esc(month(e.start, lang))} → ${esc(month(e.end, lang))}</p>
        <h3>${t(e.degree)}</h3>
        <p>${esc(e.school)}${e.school.includes(e.city) ? '' : ` · ${esc(e.city)}`}</p>
      </article>`,
    )
    .join('');

  const stack = site.skills
    .map(
      (g) =>
        `<div class="kv"><span class="k">"${esc(g.key)}"</span><span class="p">:</span> <span class="v">${g.items.map(esc).join(', ')}</span></div>`,
    )
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
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { width: 210mm; font-family: 'Geist', system-ui, sans-serif; font-size: 8.3pt; line-height: 1.4; color: #16181d; background: #fff; }
  a { color: inherit; text-decoration: none; }
  .mono, .hash, .ref, .stack, .commit__meta, .edu__dates, .kv, h2 { font-family: 'Geist Mono', ui-monospace, monospace; }
  .muted { color: #6b6e76; }

  .page { display: grid; grid-template-columns: 1fr 64mm; min-height: 296mm; }
  main { padding: 10mm 8mm 7mm 13mm; }
  aside { padding: 10mm 10mm 7mm 7mm; background: #f6f5f1; border-left: 1px solid #e4e1d9; }

  /* header */
  .top { display: flex; align-items: center; gap: 5mm; }
  .photo { position: relative; flex-shrink: 0; width: 24mm; height: 24mm; }
  .photo img { width: 100%; height: 100%; object-fit: cover; border-radius: 2px; }
  .photo::after { content: ''; position: absolute; inset: -1.6mm; background:
      linear-gradient(#fbb915,#fbb915) top left/4mm .6mm, linear-gradient(#fbb915,#fbb915) top left/.6mm 4mm,
      linear-gradient(#fbb915,#fbb915) top right/4mm .6mm, linear-gradient(#fbb915,#fbb915) top right/.6mm 4mm,
      linear-gradient(#fbb915,#fbb915) bottom left/4mm .6mm, linear-gradient(#fbb915,#fbb915) bottom left/.6mm 4mm,
      linear-gradient(#fbb915,#fbb915) bottom right/4mm .6mm, linear-gradient(#fbb915,#fbb915) bottom right/.6mm 4mm;
      background-repeat: no-repeat; }
  .photo .tag { position: absolute; left: -1.6mm; top: -5.4mm; padding: 0 1.2mm; background: #fbb915; font: 500 5.8pt 'Geist Mono', monospace; line-height: 1.6; white-space: nowrap; }
  h1 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 23pt; line-height: 0.98; letter-spacing: -0.035em; }
  h1 mark { background: #fbb915; color: #16181d; padding: 0 1.2mm 0.4mm; box-shadow: 0.9mm 0.9mm 0 #16181d; }
  .role { margin-top: 2.6mm; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 11pt; letter-spacing: -0.01em; }
  .role .at { color: #b07800; }
  .focus { margin-top: 0.6mm; font-size: 7.6pt; color: #6b6e76; }
  .logo { margin-left: auto; align-self: flex-start; height: 11mm; }
  .contact { margin-top: 3.2mm; padding: 1.8mm 2.4mm; display: flex; flex-wrap: wrap; gap: 0.6mm 3.6mm; border: 1px solid #e4e1d9; border-radius: 1.5mm; font: 400 7.5pt 'Geist Mono', monospace; color: #3a3d45; }
  .contact span::before { content: '›'; color: #b07800; margin-right: 1.2mm; }

  /* section headings: "01 ## experience" */
  h2 { display: flex; align-items: center; gap: 2mm; margin: 4.2mm 0 2mm; font-size: 8pt; font-weight: 600; color: #16181d; text-transform: lowercase; }
  h2 .i { padding: 0 1.1mm; border-radius: 0.6mm; background: #fbb915; font-size: 7pt; }
  h2 .h { color: #b07800; }
  h2::after { content: ''; flex: 1; height: 1px; background: #e4e1d9; }
  aside h2 { margin-top: 0; }
  aside section + section h2 { margin-top: 4.4mm; }

  .summary { font-size: 8.6pt; color: #2b2e35; }
  .mission { margin-top: 1.4mm; font: italic 400 7.6pt 'Geist Mono', monospace; color: #6b6e76; }

  /* experience as a git log */
  .log { position: relative; padding-left: 5mm; }
  .log::before { content: ''; position: absolute; left: 1.1mm; top: 1.6mm; bottom: 2mm; width: 0.5mm; background: #fbb915; }
  .commit { position: relative; }
  .commit + .commit { margin-top: 2.4mm; }
  .commit::before { content: ''; position: absolute; left: -5mm; top: 1mm; width: 2.4mm; height: 2.4mm; border: 0.5mm solid #fbb915; border-radius: 50%; background: #fff; }
  .commit--head::before { background: #fbb915; }
  .commit__meta { font-size: 7.2pt; color: #3a3d45; }
  .hash { color: #b07800; margin-right: 1mm; }
  .ref { margin-left: 1mm; padding: 0 1.2mm; border: 1px solid #cfcbc1; border-radius: 3mm; font-size: 6.6pt; }
  .commit--head .ref { background: #fbb915; border-color: #fbb915; }
  .commit h3 { margin-top: 0.4mm; font-size: 9.2pt; font-weight: 600; letter-spacing: -0.01em; }
  .commit h3 .at { font-weight: 500; color: #3a3d45; }
  .commit h3 .where { font-weight: 400; font-size: 8pt; color: #6b6e76; }
  .commit ul { margin-top: 1mm; list-style: none; }
  .commit li { position: relative; padding-left: 3.2mm; color: #2b2e35; }
  .commit li + li { margin-top: 0.3mm; }
  .commit li::before { content: '+'; position: absolute; left: 0; font-family: 'Geist Mono', monospace; color: #15803d; }
  .stack { margin-top: 1mm; font-size: 7pt; color: #8a8d95; }

  .side-proj { color: #2b2e35; }
  .side-proj + .side-proj { margin-top: 1mm; }

  /* sidebar */
  .kv { font-size: 7.3pt; line-height: 1.5; }
  .kv + .kv { margin-top: 1.3mm; }
  .kv .k { color: #6d28d9; }
  .kv .p { color: #8a8d95; }
  .kv .v { color: #15803d; }
  .badge { margin-top: 2.2mm; display: inline-block; padding: 0.3mm 1.8mm; border: 1px solid #15803d; border-radius: 3mm; font: 500 6.8pt 'Geist Mono', monospace; color: #15803d; }
  .edu + .edu { margin-top: 2.6mm; }
  .edu__dates { font-size: 7pt; color: #0f766e; }
  .edu h3 { font-size: 8.6pt; font-weight: 600; line-height: 1.3; }
  .edu p { color: #3a3d45; }
  .langs { list-style: none; }
  .langs li { display: flex; justify-content: space-between; padding: 0.8mm 0; border-bottom: 1px dashed #dcd8cf; }
  .langs li:last-child { border-bottom: 0; }
  .interests { color: #3a3d45; }
</style>
</head>
<body>
<div class="page">
  <main>
    <div class="top">
      ${L.photo ? `<div class="photo"><span class="tag">ai_engineer 0.98</span><img src="${avatar}" alt=""></div>` : ''}
      <div>
        <h1>${esc(p.firstName)}<br><mark>${esc(p.lastName)}</mark></h1>
        <p class="role">${t(p.role)} <span class="at">@</span> ${esc(p.company)}</p>
        <p class="focus mono">${t(p.focus)}</p>
      </div>
      <img class="logo" src="${logo}" alt="">
    </div>
    <p class="contact">${contact.map((c) => `<span>${c}</span>`).join('')}</p>

    <h2><span class="i">01</span><span class="h">##</span> ${L.summary}</h2>
    <p class="summary">${t(p.summary)}</p>
    <p class="mission">// ${t(p.mission)}</p>

    <h2><span class="i">02</span><span class="h">##</span> ${L.experience}</h2>
    <div class="log">${experience}</div>

    <h2><span class="i">03</span><span class="h">##</span> ${L.projects}</h2>
    ${projects}
    <p class="side-proj muted mono" style="font-size:7pt;margin-top:1mm">${esc(stripProtocol(itch.url))} · ${esc(stripProtocol(github.url))}</p>
  </main>

  <aside>
    <section>
      <h2><span class="h">{}</span> ${L.stack}.json</h2>
      ${stack}
      ${site.badges.map((b) => `<span class="badge">✓ ${t(b)}</span>`).join('')}
    </section>
    <section>
      <h2><span class="h">##</span> ${L.education}</h2>
      ${education}
    </section>
    <section>
      <h2><span class="h">##</span> ${L.languages}</h2>
      <ul class="langs">${languages}</ul>
    </section>
    <section>
      <h2><span class="h">##</span> ${L.interests}</h2>
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
  console.log(`✔ ${LABELS[lang].file}  (${Math.round(statSync(pdf).size / 1024)} KB, ${pages} page${pages === 1 ? '' : 's'}, logo: ${logoArg})`);
  if (pages !== 1) console.warn(`  ⚠ ${lang} resume spans ${pages} pages — tighten the content or styles.`);
  if (keepHtml) console.log(`  html: ${html}`);
}

if (!keepHtml) rmSync(work, { recursive: true, force: true });
