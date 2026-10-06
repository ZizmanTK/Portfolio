/**
 * Builds the downloadable resume PDFs (EN + FR) from src/content/site.json,
 * the same file the website renders — so the two never drift apart.
 *
 * Same design language as the website: a dark band with the surname set big in Archivo's
 * condensed cut, then ruled rows (years on the left, details on the right). Still ATS-friendly:
 * one reading order, standard section names, real selectable text.
 *
 *   npm run resume                    → src/assets/resume/*.pdf
 *   npm run resume -- --keep-html     → keep the intermediate HTML for debugging
 *   CHROME_PATH=... npm run resume    → if Chrome/Edge isn't found automatically
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
    summary: 'Summary',
    skills: 'Skills',
    experience: 'Experience',
    education: 'Education',
    additional: 'Additional information',
    projects: 'Side projects',
    languages: 'Languages',
    interests: 'Interests',
    certifications: 'Certification',
    present: 'Present',
    now: 'Now', exp: 'Experience', contract: 'Contract', based: 'Based in', speaks: 'Speaks', award: 'Award',
    photo: false,
  },
  fr: {
    file: site.profile.resume.fr,
    summary: 'Profil',
    skills: 'Compétences',
    experience: 'Expérience professionnelle',
    education: 'Formation',
    additional: 'Informations complémentaires',
    projects: 'Projets personnels',
    languages: 'Langues',
    interests: 'Centres d’intérêt',
    certifications: 'Certification',
    present: 'Aujourd’hui',
    now: 'Poste', exp: 'Expérience', contract: 'Contrat', based: 'Basé à', speaks: 'Langues', award: 'Distinction',
    photo: true, // photos are customary on French CVs
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Escapes, then turns **keyword** markers into <strong>. */
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

function month(ym, lang) {
  if (!ym) return LABELS[lang].present;
  const [y, m] = ym.split('-').map(Number);
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** Consecutive positions at the same company, grouped (as on the website). */
function groupByCompany(items) {
  const groups = [];
  for (const e of items) {
    const last = groups.at(-1);
    if (last && last.company === e.company) {
      last.positions.push(e);
      last.start = e.start;
    } else {
      groups.push({ company: e.company, start: e.start, end: e.end, positions: [e] });
    }
  }
  return groups;
}

function render(lang) {
  const L = LABELS[lang];
  const t = (v) => esc(v[lang]);
  const r = (v) => rich(v[lang]);
  const p = site.profile;
  const photo = pathToFileURL(join(root, 'src/assets/img/headshot.jpg')).href;
  // Logos are single-colour marks (alpha masks) tinted like the text, as on the website.
  const logo = (path) => (path ? `<span class="lg" style="--m:url('${pathToFileURL(join(root, 'src', path)).href}')"></span>` : '');
  const linkedin = site.socials.find((s) => s.id === 'linkedin');
  const github = site.socials.find((s) => s.id === 'github');
  const itch = site.socials.find((s) => s.id === 'itch');
  const h = site.hero;

  const contact = [
    `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`,
    `<a href="${esc(linkedin.url)}">${esc(stripProtocol(linkedin.url))}</a>`,
    `<a href="${esc(github.url)}">${esc(stripProtocol(github.url))}</a>`,
    `<a href="${esc(p.site)}">${esc(stripProtocol(p.site))}</a>`,
  ].join('');

  // The same four facts as the website's hero.
  const facts = [
    [L.exp, t(site.facts.find((f) => f.icon === 'briefcase').value)],
    [L.contract, t(h.contract)],
    [L.based, t(h.location)],
    [L.speaks, t(h.languages)],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');

  const years = (start, end) => {
    if (!end) return `${start.slice(0, 4)}–${L.now.toLowerCase() === 'poste' ? 'auj.' : 'now'}`;
    return start.slice(0, 4) === end.slice(0, 4) ? start.slice(0, 4) : `${start.slice(0, 4)}–${end.slice(2, 4)}`;
  };

  // Roles grouped under their company, so the BASSETTI progression (internship, fixed-term,
  // permanent) reads as one story and the company line isn't repeated.
  const experience = groupByCompany(site.experience)
    .map((g) => `
      <div class="co">
        <p class="co-h">${logo(g.positions[0].logo)}<b>${esc(g.company)}</b><span>${t(g.positions[0].location).split(' · ')[0]} · ${years(g.start, g.end)}</span></p>
        ${g.positions.map((e) => `
        <div class="row">
          <div class="when"><b${e.end ? '' : ' class="cur"'}>${years(e.start, e.end)}</b><span>${esc(month(e.start, lang))} – ${esc(month(e.end, lang))}</span></div>
          <div class="what">
            <h3>${t(e.role)} <span class="ty">· ${t(e.type)}</span></h3>
            <ul>${e.highlights.map((x) => `<li>${r(x)}</li>`).join('')}</ul>
          </div>
        </div>`).join('')}
      </div>`)
    .join('');

  const education = site.education
    .map((e) => `
      <div class="row">
        <div class="when"><b>${e.start.slice(0, 4)}–${e.end.slice(2, 4)}</b>${logo(e.logo)}</div>
        <div class="what">
          <h3>${t(e.degree)}</h3>
          <p class="meta">${esc(e.school)} · ${esc(e.city)}, ${t(e.country)}</p>
          ${e.award ? `<p class="aw"><em>${L.award}</em>${t(e.award)}</p>` : ''}
        </div>
      </div>`)
    .join('');

  const skills = site.skills
    .map((g) => `<div class="row kv"><div class="k">${t(g.group)}</div><div class="v">${g.items.map(esc).join(', ')}</div></div>`)
    .join('');

  const games = site.projects
    .filter((pr) => pr.category === 'games')
    .map((pr) => `<strong>${esc(pr.name)}</strong> (${pr.slug === 'roll-power' ? `${t(pr.context)}, ` : ''}${esc(pr.year ?? '')})`)
    .join(', ');
  const languages = site.languages.map((l) => `${t(l.name)} <span class="lv">${t(l.level).toLowerCase()}</span>`).join(' · ');
  const interests = site.interests.slice(0, 4).map((i) => t(i)).join(' · ');
  const certs = site.badges.map((b) => t(b)).join(' · ');

  const sec = (n, title, body) => `<section><h2><span class="n">${n}</span>${title}</h2>${body}</section>`;

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(p.name)} — ${t(p.role)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { width: 210mm; min-height: 297mm; font-family: 'Archivo', Arial, sans-serif; font-size: 8.3pt; line-height: 1.36; color: #3a3935; background: #fff; }
  a { color: inherit; text-decoration: none; }
  strong { font-weight: 600; color: #262522; }

  /* header: dark band like the website, headshot, name, contacts, the hero's facts */
  .band { display: grid; grid-template-columns: 27mm 1fr 60mm; gap: 6mm; align-items: center; padding: 7mm 12mm; background: radial-gradient(60% 120% at 25% 30%, rgba(251,185,21,.09), transparent 70%), #0d0d0e; color: #eeece7; }
  .photo { width: 27mm; height: 33.75mm; object-fit: cover; border-radius: 2.4mm; }
  h1 { font-weight: 700; font-size: 23pt; line-height: 1; letter-spacing: -0.02em; color: #eeece7; }
  h1 .sur { color: #fbb915; }
  .role { margin-top: 2mm; font-size: 11pt; font-weight: 500; color: #eeece7; }
  .role span { color: #a3a19b; white-space: nowrap; }
  .contact { display: flex; flex-wrap: wrap; gap: 0.6mm 4.5mm; margin-top: 3.4mm; font-size: 8pt; color: #c9c7c1; }
  .facts { border-top: 0.25mm solid rgba(238,236,231,.18); }
  .facts div { display: grid; grid-template-columns: 19mm 1fr; gap: 2mm; padding: 1.35mm 0; border-bottom: 0.25mm solid rgba(238,236,231,.18); font-size: 8pt; }
  .facts dt { color: #8d8b85; }
  .facts dd { color: #eeece7; }
  /* company and school logos */
  .lg { display: block; width: 18mm; height: 5.6mm; background: #8a877f; -webkit-mask: var(--m) no-repeat left center / contain; mask: var(--m) no-repeat left center / contain; }
  .co-h .lg { display: inline-block; width: auto; min-width: 5.6mm; aspect-ratio: 1; height: 4.6mm; margin-right: 0.6mm; align-self: center; }
  .co-h .lg[style*='arcelormittal'] { aspect-ratio: 2.43; }
  .when .lg { margin-top: 1.4mm; }
  main { position: relative; padding: 0 12mm 0; }
  section { margin-top: 2mm; }
  h2 { display: flex; align-items: baseline; gap: 2.4mm; padding-bottom: 0.9mm; font-size: 7.6pt; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #141413; }
  h2 .n { font-weight: 700; color: #b07c00; letter-spacing: 0.04em; }
  .row { display: grid; grid-template-columns: 23mm 1fr; gap: 4mm; padding: 1.15mm 0; border-top: 0.25mm solid #e7e4dc; }
  .when b { display: block; font-weight: 700; font-stretch: 62%; font-size: 13pt; line-height: 0.95; color: #8a877f; text-transform: uppercase; }
  .when b.cur { color: #141413; }
  .when b.cur::after { content: ''; display: inline-block; width: 1.6mm; height: 1.6mm; margin-left: 1.4mm; border-radius: 50%; background: #fbb915; vertical-align: 0.6mm; }
  .when span { display: block; margin-top: 0.8mm; font-size: 7pt; color: #8a877f; }
  .co + .co { margin-top: 1.6mm; }
  .co-h { display: flex; align-items: baseline; gap: 2.4mm; padding: 1.4mm 0 0.6mm; border-top: 0.35mm solid #141413; }
  .co-h b { font-size: 10.4pt; font-weight: 700; color: #141413; letter-spacing: -0.01em; }
  .co-h span { font-size: 8pt; color: #77746c; }
  .co .row:first-of-type { border-top-color: #e7e4dc; }
  h3 .ty { font-weight: 400; color: #77746c; font-size: 8.4pt; }
  h3 { font-size: 9.6pt; font-weight: 600; line-height: 1.25; color: #141413; letter-spacing: -0.005em; }
  .meta { font-size: 8.2pt; color: #77746c; }
  ul { margin-top: 0.7mm; list-style: none; }
  li { padding-left: 3.4mm; background: linear-gradient(#e0a100, #e0a100) 0 0.68em / 1.8mm 0.3mm no-repeat; }
  li + li { margin-top: 0.3mm; }
  ul { font-size: 8.1pt; line-height: 1.32; }
  .aw { margin-top: 0.8mm; }
  .aw em { font-style: normal; font-size: 6.8pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #b07c00; margin-right: 2mm; }
  .summary { font-size: 9pt; line-height: 1.4; color: #3a3935; padding: 1.6mm 0 0.6mm; border-top: 0.25mm solid #e7e4dc; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; column-gap: 8mm; }
  .kv { grid-template-columns: 31mm 1fr; padding: 0.9mm 0; align-items: baseline; }
  .grid2 .kv { grid-template-columns: 25mm 1fr; gap: 3mm; }
  .kv .k { font-weight: 600; color: #141413; font-size: 8.4pt; }
  .kv .v { color: #3a3935; }
  .lv { color: #8a877f; }
  /* French runs longer: a touch denser so it stays on one page */
  body.fr ul { font-size: 7.9pt; }
  body.fr .row { padding: 0.85mm 0; }
  body.fr section { margin-top: 1.5mm; }
  body.fr .summary { font-size: 8.8pt; }
  body.fr .kv { padding: 0.75mm 0; }
  /* English has room to breathe */
  body.en section { margin-top: 2.5mm; }
  body.en .row { padding: 1.4mm 0; }
  body.en .kv { padding: 1mm 0; }
</style>
</head>
<body class="${lang}">
  <header class="band">
    <img class="photo" src="${photo}" alt="">
    <div class="who">
      <h1>${esc(p.firstName)} <span class="sur">${esc(p.lastName)}</span></h1>
      <p class="role">${t(p.role)} <span>· ${esc(p.company)}</span></p>
      <p class="contact">${contact}</p>
    </div>
    <dl class="facts">${facts}</dl>
  </header>
  <main>
    ${sec('#1', L.summary, `<p class="summary">${r(p.summary)}</p>`)}
    ${sec('#2', L.experience, experience)}
    ${sec('#3', L.education, education)}
    ${sec('#4', L.skills, skills)}
    ${sec('#5', L.additional, `
      <div class="row kv"><div class="k">${L.languages}</div><div class="v">${languages}</div></div>
      <div class="row kv"><div class="k">${L.projects}</div><div class="v">Unity${lang === 'fr' ? ' :' : ':'} ${games}, ${esc(stripProtocol(itch.url))}</div></div>
      <div class="row kv"><div class="k">${L.certifications}</div><div class="v">${certs}</div></div>
      <div class="row kv"><div class="k">${L.interests}</div><div class="v">${interests}</div></div>`)}
  </main>
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
