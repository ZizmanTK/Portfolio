/**
 * Builds the downloadable resume PDFs (EN + FR) from src/content/site.json,
 * the same file the website renders — so the two never drift apart.
 *
 * A plain one-page résumé, made to be read by applicant tracking systems as well as by people: one
 * column, read from top to bottom; standard section names (Experience, Education, Skills, Languages,
 * Interests), each a heading on its own line; contacts as plain text; text bullets; no
 * logos, icons or coloured blocks. It is set in Arial, which every system and parser knows, in two
 * weights; from the website it keeps only one stroke of gold under each heading.
 *
 * Ordered by what a recruiter checks first: name, AI Engineer, specialties, open to work,
 * experience, location and contacts; then the summary, jobs, degrees, skills, languages and
 * interests. The three projects are told in the jobs; in the summary their names link to their
 * public proof.
 *
 * For the parsers: real selectable text, and the HTML order is the reading order. Chrome writes
 * text into the PDF in paint order, and positioned elements paint last, so no element that holds
 * text is positioned. Ligatures are off so extracted words keep plain letters ("workflows", not
 * "workﬂows"). No text is letter-spaced: pdftotext split letter-spaced labels into loose letters
 * ("F R O NT- E N D"). Every weight of a font sets some text with a space in it: its subset then
 * has a real space glyph; without one, some extractors (pypdf) take the subset's code 0x20, which
 * Chrome gives to another letter, for a space ("E XPE RIE NCE").
 *
 *   npm run resume                             → src/assets/resume/*.pdf
 *   npm run resume -- --keep-html              → keep the intermediate HTML for debugging
 *   npm run resume -- --no-photo --out=<dir>   → the same pages without his picture, written to
 *                                                <dir>: for countries where a résumé carries none
 *   CHROME_PATH=... npm run resume             → if Chrome/Edge isn't found automatically
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(join(root, 'src/content/site.json'), 'utf8'));
const keepHtml = process.argv.includes('--keep-html');
const noPhoto = process.argv.includes('--no-photo');
const outArg = process.argv.find((a) => a.startsWith('--out='));
const outDir = outArg ? resolve(outArg.slice('--out='.length)) : join(root, 'src/assets/resume');
if (noPhoto && !outArg) {
  console.error('--no-photo needs --out=<dir>: the PDFs in src/assets/resume are the ones the website serves.');
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

/**
 * Fonts expected in the PDFs, by the name Chrome embeds them under: Arial and Arial Bold, from the
 * system. Anything else is a fallback font, which means Arial is not installed.
 */
const EXPECTED_FONTS = { ArialMT: 'Arial', 'Arial-BoldMT': 'Arial Bold' };

const LABELS = {
  en: {
    file: site.profile.resume.en,
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    interests: 'Interests',
    present: 'Present',
    award: 'Award',
  },
  fr: {
    file: site.profile.resume.fr,
    experience: 'Expérience professionnelle',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    interests: 'Centres d’intérêt',
    present: 'aujourd’hui',
    award: 'Distinction',
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Escapes, then turns **keyword** markers into <strong>. */
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
/** " · " that never starts a line: the line can only break after the dot. */
const SEP = '\u00a0· ';

function month(ym, lang) {
  const [y, m] = ym.split('-').map(Number);
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

/** "Sep 2025 – Present", "Feb – Jul 2024", "Sep 2024 – Sep 2025" (and the French equivalents). */
function period(start, end, lang) {
  if (!end) return `${month(start, lang)} – ${LABELS[lang].present}`;
  return `${month(start, lang)} – ${month(end, lang)}`;
}

function render(lang) {
  const L = LABELS[lang];
  // Typographic apostrophes; French typography: a no-break space before the colon; and the " · " separators never start
  // a line (the words stay as written).
  const typo = (s) => (lang === 'fr' ? s.replace(/ ([:;!?])/g, ' $1') : s).replaceAll("'", '’').replaceAll(' · ', SEP);
  const t = (v) => esc(typo(v[lang]));
  const r = (v) => rich(typo(v[lang]));
  const colon = lang === 'fr' ? ' :' : ':';
  const p = site.profile;
  const h = site.hero;
  const social = Object.fromEntries(site.socials.map((s) => [s.id, s]));
  const photo = pathToFileURL(join(root, 'src/assets/img/headshot.jpg')).href;

  // Header contacts, as plain text on two lines: where to write and call, then where to look. The phone only renders
  // when site.json has one.
  const a = (href, text = stripProtocol(href)) => `<a class="nw" href="${esc(href)}">${esc(text)}</a>`;
  const contacts = [
    [a(`mailto:${p.email}`, p.email), ...(p.phone ? [a(`tel:${p.phone.replace(/[^\d+]/g, '')}`, p.phone)] : [])],
    [a(social.linkedin.url), a(social.github.url), a(p.site)],
  ]
    .map((line) => `<p>${line.join(SEP)}</p>`)
    .join('');

  // The jobs, newest first, and the degrees are set alike: a line with the title and the dates at its end, then the
  // details. A job has its company, contract and place after its title; a degree has its school on the next line.
  const entry = (title, rest, when, body = '') => `
        <li class="it">
          <div class="top"><div class="what"><h3>${title}</h3>${rest}</div><p class="when">${when}</p></div>${body}
        </li>`;

  // One entry per role: the same title at the same company, kept on from a fixed-term to a permanent contract, is one
  // job from its first month to its last, its lines newest first. Like most CVs, it names the contract only for an
  // internship. The tools of each job are named in its lines and listed under Skills.
  const roles = site.experience.reduce((list, e) => {
    const last = list.at(-1);
    if (last && last.role.en === e.role.en && last.company === e.company) {
      list[list.length - 1] = { ...last, start: e.start, highlights: [...last.highlights, ...e.highlights] };
    } else list.push(e);
    return list;
  }, []);
  const experience = roles
    .map((e) =>
      entry(
        t(e.role),
        `${SEP}<span class="co">${esc(e.company)}</span>${/intern/i.test(e.type.en) ? `${SEP}${t(e.type)}` : ''}${SEP}${t(e.location)}`,
        esc(period(e.start, e.end, lang)),
        `<ul class="pts">${e.highlights.map((x) => `<li>${r(x)}</li>`).join('')}</ul>`,
      ),
    )
    .join('');

  // The three projects are told in the jobs. In the summary, the public name of a project ("TEEXMA chatbot" for TxBot)
  // links to its public proof: its demo, else BASSETTI's announcement.
  const summary = site.projects
    .filter((pr) => pr.featured)
    .reduce((html, pr) => {
      const proof = pr.study?.proof?.[0];
      const url = pr.links.demo ?? (proof && (typeof proof.url === 'string' ? proof.url : proof.url[lang]));
      const name = `<strong>${pr.title ? t(pr.title) : esc(pr.name)}</strong>`;
      return url ? html.replace(name, () => `<a class="lk" href="${esc(url)}">${name}</a>`) : html;
    }, r(p.summary));

  const education = site.education
    .map((e) =>
      entry(
        esc(typo(e.degree[lang])),
        '',
        `${e.start.slice(0, 4)} – ${e.end ? e.end.slice(0, 4) : L.present}`,
        `<p><span class="co">${esc(typo(e.school))}</span>${SEP}${esc(e.city)}, ${t(e.country)}${e.award ? `${SEP}<b>${L.award}${colon}</b> ${t(e.award)}` : ''}</p>`,
      ),
    )
    .join('');

  const skills = site.skills.map((g) => `<p class="sg"><b>${t(g.group)}${colon}</b> ${g.items.map(esc).join(', ')}</p>`).join('');

  const languages = site.languages.map((l) => `<span class="nw"><b>${t(l.name)}</b> (${t(l.level).toLowerCase()})</span>`).join(', ');

  // His games sit with game development; the other interests follow on the next line.
  const [gamedev, ...hobbies] = site.interests;
  const games = site.projects
    .filter((pr) => pr.category === 'games')
    .sort((a, b) => Number(b.slug === 'zktris') - Number(a.slug === 'zktris'))
    .map((pr) => `<span class="nw">${esc(pr.name)}</span> (${pr.slug === 'roll-power' ? `${t(pr.context)}, ` : ''}${esc(pr.year)})`)
    .join(', ');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(p.name)} — ${t(h.role)}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #111110;
    --text: #2b2a26;
    --muted: #5b5952;
    --line: #cfcdc6;
    --gold: #fbb915;
    --f: Arial, Helvetica, sans-serif;
    /* French runs longer and is set a touch denser */
    --fs: 9.4pt; --lh: 1.35; --sec: 3.2mm; --it: 1.6mm;
  }
  body.fr { --fs: 9pt; --lh: 1.36; }
  html { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    width: 210mm; min-height: 297mm; padding: 10mm 12mm 7mm;
    font: 400 var(--fs)/var(--lh) var(--f); color: var(--text); font-variant-ligatures: none; font-kerning: normal;
    background: #fff;
  }
  a { color: inherit; text-decoration: none; }
  strong, b { font-weight: 700; color: var(--ink); }
  p, li { text-wrap: pretty; }
  ul, ol { list-style: none; }
  .nw { white-space: nowrap; }

  /* ---------- header: who, what, where to reach him; his picture at the end of the line ---------- */
  .hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 8mm; padding-bottom: 3.2mm; border-bottom: 0.4mm solid var(--ink); }
  h1 { font: 700 23pt/1 var(--f); color: var(--ink); }
  .tl { margin-top: 1.5mm; font-size: 10.6pt; line-height: 1.3; color: var(--ink); }
  .role { font: 700 13.5pt/1 var(--f); }
  .facts { margin-top: 2mm; }
  .ct { margin-top: 0.6mm; }
  .ph { flex: none; width: 24mm; height: 30mm; object-fit: cover; border-radius: 0.8mm; }
  .sum { margin-top: 3.2mm; font-size: 1.06em; color: var(--ink); }

  /* ---------- sections, one under the other ---------- */
  section { margin-top: var(--sec); }
  h2 {
    margin-bottom: 1.5mm; padding-bottom: 1.1mm; font: 700 11.5pt/1 var(--f); color: var(--ink);
    background: linear-gradient(var(--gold), var(--gold)) 0 100% / 9mm 0.7mm no-repeat, linear-gradient(var(--line), var(--line)) 0 100% / 100% 0.25mm no-repeat;
  }
  .it + .it { margin-top: var(--it); }
  .top { display: flex; justify-content: space-between; align-items: baseline; gap: 5mm; }
  .what { min-width: 0; }
  h3 { display: inline; font: 700 1.07em/1.3 var(--f); color: var(--ink); }
  .co { white-space: nowrap; color: var(--ink); }
  .when { flex: none; white-space: nowrap; color: var(--ink); }
  /* the bullets are text, as parsers expect them, hung in the margin of their lines */
  .pts { margin-top: 0.6mm; }
  .pts li { padding-left: 3.8mm; text-indent: -3.8mm; }
  .pts li::before { content: "•"; display: inline-block; width: 3.8mm; text-indent: 0; color: var(--muted); }
  .pts li + li { margin-top: 0.3mm; }
  .lk { text-decoration: underline; text-decoration-thickness: 0.15mm; text-underline-offset: 0.5mm; }
  .sg + .sg { margin-top: 0.5mm; }
</style>
</head>
<body class="${lang}">
  <header class="hd">
    <div class="id">
      <h1>${esc(p.name)}</h1>
      <p class="tl"><strong class="role">${t(h.role)}</strong>${SEP}${h.focus.map((f) => t(f)).join(SEP)}</p>
      <div class="facts"><p><b>${t(h.status)}</b>${p.workRights ? `${SEP}${t(p.workRights)}` : ""}</p><p>${t(h.experience)}${SEP}${t(h.location)}</p></div>
      <div class="ct">${contacts}</div>
    </div>${noPhoto ? '' : `\n    <img class="ph" src="${photo}" alt="">`}
  </header>
  <p class="sum">${summary}</p>
  <section><h2>${L.experience}</h2><ol>${experience}</ol></section>
  <section><h2>${L.education}</h2><ol>${education}</ol></section>
  <section><h2>${L.skills}</h2>${skills}</section>
  <section><h2>${L.languages}</h2><p>${languages}</p></section>
  <section><h2>${L.interests}</h2><p>${t(gamedev)}${colon} ${games}${SEP}<a href="${esc(social.itch.url)}">${esc(stripProtocol(social.itch.url))}</a></p><p>${hobbies.map((i) => `<span class="nw">${t(i)}</span>`).join(SEP)}</p></section>
</body>
</html>`;
}

/** Fonts embedded in a PDF written by Chrome, by name (from entries like /BaseFont /AAAAAA+ArialMT). */
function embeddedFonts(pdf) {
  const names = readFileSync(pdf, 'latin1').match(/\/BaseFont\s*\/[^\s/<>[\]()]+/g) ?? [];
  return new Set(names.map((n) => n.replace(/^\/BaseFont\s*\/(?:[A-Z]{6}\+)?/, '')));
}

mkdirSync(outDir, { recursive: true });
const work = mkdtempSync(join(tmpdir(), 'resume-'));

for (const lang of ['en', 'fr']) {
  const html = join(work, `resume-${lang}.html`);
  writeFileSync(html, render(lang));
  const pdf = join(outDir, basename(LABELS[lang].file));
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=15000',
    `--print-to-pdf=${pdf}`,
    pathToFileURL(html).href,
  ], { stdio: 'ignore' });

  const pages = (readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`✔ ${LABELS[lang].file}  (${Math.round(statSync(pdf).size / 1024)} KB, ${pages} page${pages === 1 ? '' : 's'})`);
  if (pages !== 1) console.warn(`  ⚠ ${lang} resume spans ${pages} pages — tighten the content or styles.`);
  const fonts = embeddedFonts(pdf);
  const missing = Object.keys(EXPECTED_FONTS).filter((f) => !fonts.has(f)).map((f) => EXPECTED_FONTS[f]);
  const fallbacks = [...fonts].filter((f) => !(f in EXPECTED_FONTS));
  if (missing.length || fallbacks.length) {
    console.warn(`  ⚠ ${lang} fonts: missing ${missing.join(', ') || 'none'}; fallbacks ${fallbacks.join(', ') || 'none'} (is Arial installed?)`);
  }
  if (keepHtml) console.log(`  html: ${html}`);
}

if (!keepHtml) rmSync(work, { recursive: true, force: true });
