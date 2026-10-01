/**
 * Builds the downloadable resume PDFs (EN + FR) from src/content/site.json,
 * the same file the website renders — so the two never drift apart.
 *
 * Layout is recruiter- and ATS-friendly: one column, standard section names,
 * real selectable text, dates right-aligned, keywords bolded (**like this** in the JSON).
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
  const avatar = pathToFileURL(join(root, 'src', p.avatar)).href;
  const logo = pathToFileURL(join(root, 'src/assets/img/logo.svg')).href;
  const linkedin = site.socials.find((s) => s.id === 'linkedin');
  const github = site.socials.find((s) => s.id === 'github');
  const itch = site.socials.find((s) => s.id === 'itch');

  const contact = [
    `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`,
    esc(p.location[lang]),
    `<a href="${esc(linkedin.url)}">${esc(stripProtocol(linkedin.url))}</a>`,
    `<a href="${esc(github.url)}">${esc(stripProtocol(github.url))}</a>`,
    `<a href="${esc(p.site)}">${esc(stripProtocol(p.site))}</a>`,
  ].join('<span class="sep">|</span>');

  const facts = site.facts.filter((f) => f.icon !== 'pin').map((f) => `<span>${t(f.value)}</span>`).join('<span class="dot">•</span>');

  const skills = site.skills
    .map((g) => `<tr><th>${t(g.group)}</th><td>${g.items.map(esc).join(', ')}</td></tr>`)
    .join('');
  const certs = site.badges.map((b) => t(b)).join(' · ');

  const experience = groupByCompany(site.experience)
    .map(
      (g) => `
      <div class="company">
        <div class="row company__head"><h3>${esc(g.company)}</h3><span class="dates">${esc(month(g.start, lang))} – ${esc(month(g.end, lang))}</span></div>
        ${g.positions
          .map(
            (e) => `
          <div class="pos">
            <div class="row"><h4>${t(e.role)} <span class="type">· ${t(e.type)} · ${t(e.location)}</span></h4><span class="dates dates--pos">${esc(month(e.start, lang))} – ${esc(month(e.end, lang))}</span></div>
            <ul>${e.highlights.map((h) => `<li>${r(h)}</li>`).join('')}</ul>
          </div>`,
          )
          .join('')}
      </div>`,
    )
    .join('');

  const education = site.education
    .map(
      (e) => `
      <div class="row edu"><div><h4>${t(e.degree)}</h4><p>${esc(e.school)} — ${esc(e.city)}, ${t(e.country)}</p></div><span class="dates">${esc(month(e.start, lang))} – ${esc(month(e.end, lang))}</span></div>`,
    )
    .join('');

  const games = site.projects
    .filter((pr) => pr.category === 'games')
    .map((pr) => `<strong>${esc(pr.name)}</strong> (${pr.slug === 'roll-power' ? `${t(pr.context)} ` : ''}${esc(pr.year ?? '')})`)
    .join(' · ');

  const languages = site.languages.map((l) => `${t(l.name)} (${t(l.level).toLowerCase()})`).join(' · ');
  // The CV keeps the first four interests to stay on one page; the site lists them all.
  const interests = site.interests.slice(0, 4).map((i) => t(i)).join(' · ');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(p.name)} — ${t(p.role)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { width: 210mm; padding: 10mm 14mm 3mm; font-family: 'Geist', Arial, sans-serif; font-size: 9pt; line-height: 1.35; color: #111827; }
  a { color: inherit; text-decoration: none; }
  strong { font-weight: 600; color: #111827; }

  header { display: flex; align-items: center; gap: 5mm; }
  .photo { width: 20mm; height: 20mm; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
  .who { flex: 1; }
  h1 { font-size: 21pt; font-weight: 700; letter-spacing: -0.02em; line-height: 1.05; }
  .title { margin-top: 1mm; font-size: 12pt; font-weight: 600; }
  .title .co { color: #8a5a00; }
  .logo { height: 12mm; align-self: flex-start; }
  .contact { margin-top: 2.2mm; font-size: 8.4pt; color: #374151; }
  .sep { margin: 0 1.6mm; color: #9ca3af; }
  .contact a { white-space: nowrap; }
  .facts { margin-top: 3mm; padding: 1.6mm 3mm; border-radius: 1.5mm; background: #fff6dc; font-size: 8.8pt; font-weight: 600; }
  .dot { margin: 0 2mm; color: #e9a400; }

  h2 { margin: 3.4mm 0 1.5mm; padding-bottom: 0.8mm; border-bottom: 0.6mm solid #fbb915; font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .summary { color: #1f2937; }

  table { width: 100%; border-collapse: collapse; }
  th { width: 38mm; padding: 0.5mm 3mm 0.5mm 0; text-align: left; vertical-align: top; font-weight: 600; }
  td { padding: 0.5mm 0; color: #1f2937; }
  .cert { margin-top: 1mm; }

  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; }
  .dates { flex-shrink: 0; font-weight: 600; font-size: 8.6pt; }
  .dates--pos { font-weight: 500; color: #374151; }
  .company + .company { margin-top: 2.2mm; }
  .company__head h3 { font-size: 10.4pt; font-weight: 700; }
  .pos { margin-top: 1.2mm; }
  .pos h4 { font-size: 9.6pt; font-weight: 600; }
  .pos .type { font-weight: 400; color: #4b5563; }
  .pos ul { margin: 0.6mm 0 0 4.2mm; color: #1f2937; }
  .pos li { padding-left: 0.6mm; }
  .pos li + li { margin-top: 0.3mm; }
  .pos li::marker { color: #b07800; }

  .edu + .edu { margin-top: 1mm; }
  .edu h4 { font-size: 9.4pt; font-weight: 600; }
  .edu p { color: #374151; }

  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
  .two h2 { margin-top: 4mm; }
  .muted { color: #4b5563; }
</style>
</head>
<body>
  <header>
    ${L.photo ? `<img class="photo" src="${avatar}" alt="">` : ''}
    <div class="who">
      <h1>${esc(p.name)}</h1>
      <p class="title">${t(p.role)} — <span class="co">${esc(p.company)}</span></p>
      <p class="contact">${contact}</p>
    </div>
    <img class="logo" src="${logo}" alt="">
  </header>
  <p class="facts">${facts}</p>

  <h2>${L.summary}</h2>
  <p class="summary">${r(p.summary)}</p>

  <h2>${L.skills}</h2>
  <table>${skills}<tr><th>${L.certifications}</th><td>${certs}</td></tr></table>

  <h2>${L.experience}</h2>
  ${experience}

  <h2>${L.education}</h2>
  ${education}

  <h2>${L.additional}</h2>
  <table>
    <tr><th>${L.languages}</th><td>${languages}</td></tr>
    <tr><th>${L.projects}</th><td>Unity${lang === 'fr' ? ' :' : ':'} ${games} — <a href="${esc(itch.url)}">${esc(stripProtocol(itch.url))}</a></td></tr>
    <tr><th>${L.interests}</th><td>${interests}</td></tr>
  </table>
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
