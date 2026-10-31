/**
 * Builds the downloadable resume PDFs (EN + FR) from src/content/site.json,
 * the same file the website renders — so the two never drift apart.
 *
 * Same design language as the website ("a walk through a day"): warm cream paper, his warm black
 * and gold; a thin dawn-to-night band across the top of the page; experience and education hung
 * on one gold thread with a knot per stop (the current job's knot is the night one), dates as mono
 * stamps. Switzer for text, General Sans for display, IBM Plex Mono for stamps and labels.
 *
 * Ordered by what a recruiter checks first: name, AI Engineer, specialties, open to work,
 * experience, location and contacts; then jobs, degrees, skills, languages, projects, interests.
 *
 * ATS-friendly: real selectable text, standard section names, and the HTML order is the reading
 * order (header, experience, education, then the side column). Chrome writes text into the PDF in
 * paint order, and positioned elements paint last, so no element that holds text is positioned:
 * the band, the thread, the knots and the bullet dashes are backgrounds, and logos and icons are
 * inline SVG or plain images (not CSS masks, which print as soft-mask groups whose edges show as
 * hairlines). Ligatures are off so extracted words keep plain letters ("workflows", not "workﬂows").
 * All the mono text uses one weight of IBM Plex Mono: the headings then share the date stamps' font
 * subset, which has a real space glyph; without one, some extractors (pypdf) take the subset's code
 * 0x20, which Chrome gives to the capital E, for a space ("E XPE RIE NCE").
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
const ICONS = JSON.parse(readFileSync(join(root, 'src/content/skill-icons.json'), 'utf8')).icons;
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

/**
 * Fonts expected in the PDFs, by the name Chrome embeds them under. Fontshare's webfonts carry no
 * family name (their name table literally says "false"), so Switzer and General Sans show up as
 * "false". Anything else is a fallback font, which means the web fonts didn't load (offline?).
 */
const EXPECTED_FONTS = { false: 'Switzer / General Sans', IBMPlexMono: 'IBM Plex Mono' };

const LABELS = {
  en: {
    file: site.profile.resume.en,
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    projects: 'Projects',
    interests: 'Interests',
    present: 'Present',
    award: 'Award',
    demo: 'Demo',
  },
  fr: {
    file: site.profile.resume.fr,
    experience: 'Expérience professionnelle',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    projects: 'Projets',
    interests: 'Centres d’intérêt',
    present: 'aujourd’hui',
    award: 'Distinction',
    demo: 'Démo',
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Escapes, then turns **keyword** markers into <strong>. */
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const mm = (v) => `${+v.toFixed(3)}mm`;
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
  if (start.slice(0, 4) === end.slice(0, 4)) return `${month(start, lang).replace(/\s*\d{4}$/, '')} – ${month(end, lang)}`;
  return `${month(start, lang)} – ${month(end, lang)}`;
}

const svgDoc = (body, viewBox = '0 0 24 24') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`;
const svgUri = (body, viewBox) => `data:image/svg+xml;utf8,${encodeURIComponent(svgDoc(body, viewBox))}`;

/**
 * Icons and logo marks are drawn inline (SVG in currentColor, or a plain image), never as CSS masks:
 * Chrome prints a mask as a soft-mask group, and PDF viewers draw hairlines along those groups' edges.
 * Every icon here is a single-colour drawing, so each of its colours becomes currentColor.
 */
const svgIcon = (svg, cls) =>
  svg
    .replace(/<\?xml[^>]*>\s*/, '')
    .replace(/<svg\b([^>]*)>/, (_, attrs) => {
      const a = attrs.replace(/\s(?:width|height|class|id)="[^"]*"/g, '');
      return `<svg class="${cls}" aria-hidden="true"${/\sfill=/.test(a) ? '' : ' fill="currentColor"'}${a}>`;
    })
    .replace(/(fill|stroke)="#[0-9a-fA-F]{3,8}"/g, '$1="currentColor"')
    .replace(/\s+/g, ' ');
const SKILL_ICONS = Object.fromEntries(
  Object.entries(ICONS).map(([name, { mask }]) => [name, svgIcon(decodeURIComponent(mask.replace(/^data:image\/svg\+xml;utf8,/, '')), 'ic')]),
);

// Contact icons: Lucide (ISC) for mail and phone, Simple Icons (CC0) for LinkedIn and GitHub,
// and his own ZTK crown (src/assets/img/logo.svg) for the portfolio site.
const stroke = 'fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const CONTACT_ICONS = Object.fromEntries(Object.entries({
  mail: svgDoc(`<rect x="2" y="4" width="20" height="16" rx="2" ${stroke}/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" ${stroke}/>`),
  phone: svgDoc(
    `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" ${stroke}/>`,
  ),
  linkedin: svgDoc(
    '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
  ),
  github: svgDoc(
    '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  ),
  site: readFileSync(join(root, 'src/assets/img/logo.svg'), 'utf8'),
}).map(([name, svg]) => [name, svgIcon(svg, 'ic')]));

// The thread's knots, drawn as SVG backgrounds: a hollow knot per stop, and the current job's
// "night" knot (black-bronze with a gold ring and a faint glow). Fills match --paper / --night.
const knotUri = (fill, ring, glow = '') =>
  svgUri(`${glow}<circle cx="6" cy="6" r="3.55" fill="${fill}" stroke="${ring}" stroke-width="1.1"/>`, '0 0 12 12');
const KNOT = knotUri('#f8f4ec', '#c58f24');
const KNOT_NOW = knotUri('#1d1307', '#fbb915', '<circle cx="6" cy="6" r="5.1" fill="#fbb915" fill-opacity=".26"/>');

/**
 * Company and school marks, set in a 4.4 × 3 mm slot before the name: the emblems only, as on the
 * website (the wordmarks in the lock-ups are illegible at that size). The PNG marks (black with
 * alpha) are cropped to their emblem by a clipping box; the BASSETTI B is lifted from the colour
 * icon (its B at full strength and the light bowl at 55 %, without the dark square).
 */
const MARK_SLOT = [4.4, 3]; // mm
const MARK_CROPS = {
  // [x, y, w, h] in source pixels
  'assets/logos/marks/arcelormittal.png': [132, 0, 160, 64], // the swoosh, without the wordmark
  'assets/logos/marks/ibn-ghazi.png': [27, 0, 132, 108], // crest and laurels, without "RÉSEAU IBNGHAZI"
  'assets/logos/marks/lex-niamey.png': [112, 30, 178, 128], // the LEX pyramid, without the scroll banner
};
const BASSETTI_B = (() => {
  const svg = readFileSync(join(root, 'src/assets/logos/bassetti-group-icon.svg'), 'utf8');
  const d = (cls) => svg.match(new RegExp(`<path class="${cls}" d="([^"]+)"`))[1];
  const [w, h] = [989.74, 1438.27]; // the B's own box in the icon's coordinates
  const s = Math.min(MARK_SLOT[0] / w, MARK_SLOT[1] / h);
  return svgIcon(svgDoc(`<path d="${d('st1')}"/><path fill-opacity=".55" d="${d('st2')}"/>`, `1085.4 857.26 ${w} ${h}`), 'mk')
    .replace('<svg ', `<svg style="width:${mm(w * s)};height:${mm(h * s)}" `);
})();
function mark(path) {
  if (path.endsWith('/bassetti.png')) return BASSETTI_B;
  const png = readFileSync(join(root, 'src', path));
  const [iw, ih] = [png.readUInt32BE(16), png.readUInt32BE(20)]; // PNG IHDR
  const [bx, by, bw, bh] = MARK_CROPS[path] ?? [0, 0, iw, ih];
  const s = Math.min(MARK_SLOT[0] / bw, MARK_SLOT[1] / bh); // mm per source pixel
  const img = `<img src="data:image/png;base64,${png.toString('base64')}" alt="" style="width:${mm(iw * s)};height:${mm(ih * s)};margin:${mm(-by * s)} 0 0 ${mm(-bx * s)}">`;
  return `<span class="mk" style="width:${mm(bw * s)};height:${mm(bh * s)}">${img}</span>`;
}

function render(lang) {
  const L = LABELS[lang];
  // French typography: a no-break space before the colon; and the " · " separators never start a line (the words stay as written).
  const typo = (s) => (lang === 'fr' ? s.replace(/ ([:;!?])/g, '\u00a0$1') : s).replaceAll(' · ', SEP);
  const t = (v) => esc(typo(v[lang]));
  const r = (v) => rich(typo(v[lang]));
  const p = site.profile;
  const h = site.hero;
  const social = Object.fromEntries(site.socials.map((s) => [s.id, s]));
  const photo = pathToFileURL(join(root, 'src/assets/img/headshot.jpg')).href;
  // Company and school marks, tinted like the text, as on the website.
  const logo = (path) => (path ? `<span class="lg" aria-hidden="true">${mark(path)}</span>` : '');
  const dot = `<i class="sep">${SEP}</i>`;

  // Header contacts; the phone only renders when site.json has one.
  const contacts = [
    ['mail', `mailto:${p.email}`, p.email],
    ...(p.phone ? [['phone', `tel:${p.phone.replace(/[^\d+]/g, '')}`, p.phone]] : []),
    ['linkedin', social.linkedin.url, stripProtocol(social.linkedin.url)],
    ['github', social.github.url, stripProtocol(social.github.url)],
    ['site', p.site, stripProtocol(p.site)],
  ]
    .map(([icon, href, text]) => `<li><a href="${esc(href)}">${CONTACT_ICONS[icon]}${esc(text)}</a></li>`)
    .join('');

  // One knot per role on the thread, newest first; the dates are the stamp at the knot, above the title.
  const experience = site.experience
    .map((e) => `
        <li class="stop${e.end ? '' : ' now'}">
          <p class="when">${esc(period(e.start, e.end, lang))}</p>
          <h3>${t(e.role)}</h3>
          <p class="org">${logo(e.logo)}<span class="co">${esc(e.company)}</span>${dot}${t(e.type)}${dot}${t(e.location)}</p>
          <ul class="pts">${e.highlights.map((x) => `<li>${r(x)}</li>`).join('')}</ul>
          <p class="stk">${e.stack.map(esc).join(SEP)}</p>
        </li>`)
    .join('');

  // Degree names read "Engineering degree — Images, Signals & Data Science": the field is set lighter.
  const degree = (e) => {
    const [main, field] = typo(e.degree[lang]).split(' — ');
    return `${esc(main)}${field ? ` <span class="fd">— ${esc(field)}</span>` : ''}`;
  };
  const education = site.education
    .map((e) => `
        <li class="stop">
          <p class="when">${e.start.slice(0, 4)} – ${e.end ? e.end.slice(0, 4) : L.present}</p>
          <h3>${degree(e)}</h3>
          <p class="org">${logo(e.logo)}<span class="co">${esc(e.school)}</span>${dot}${esc(e.city)}, ${t(e.country)}</p>
          ${e.award ? `<p class="aw"><em>${L.award}</em> ${t(e.award)}</p>` : ''}
        </li>`)
    .join('');

  const skills = site.skills
    .map((g) => `
        <div class="sg">
          <h3>${t(g.group)}</h3>
          <p class="sk">${g.items.map((it) => `<span>${SKILL_ICONS[it] ?? ''}${esc(it)}</span>`).join(' ')}</p>
        </div>`)
    .join('');

  const languages = site.languages.map((l) => `<li><b>${t(l.name)}</b> <span>${t(l.level)}</span></li>`).join('');

  const projects = site.projects
    .filter((pr) => pr.featured)
    .map((pr) => `
        <div class="pj">
          <h3>${esc(pr.name)} <span class="k">${t(pr.kicker)}</span></h3>
          <p class="w">${esc(pr.when)}${pr.links.demo ? `${dot}<a href="${esc(pr.links.demo)}">${L.demo}</a>` : ''}</p>
          <p>${t(pr.tagline)}</p>
        </div>`)
    .join('');

  // His games sit with game development; the other interests follow on one line.
  const [gamedev, ...hobbies] = site.interests;
  const games = site.projects
    .filter((pr) => pr.category === 'games')
    .sort((a, b) => Number(b.slug === 'zktris') - Number(a.slug === 'zktris'))
    .map((pr) => `<b class="nw">${esc(pr.name)}</b> (${pr.slug === 'roll-power' ? `${t(pr.context)}, ` : ''}${esc(pr.year)})`)
    .join(', ');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(p.name)} — ${t(h.role)}</title>
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600&f[]=general-sans@400,500,600,700&display=block" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    /* the website's paper palette (its résumé view) with his black + gold */
    --paper: #f8f4ec;
    --ink: #17140f;
    --ink-2: #39332b;
    --muted: #635a4e;           /* 6.2:1 on the paper */
    --line: rgba(23, 20, 15, .13);
    --bronze: #7a5208;          /* small gold-ish text on paper: 6.3:1 */
    --gold: #fbb915;            /* the anchor: fills, rules and small marks only */
    --thread: #e0a31c;
    --icon: #a87512;            /* contact icons: the crown's bronze-gold on paper (as on the website) */
    --ok: #24864a; --ok-ink: #155d31; --ok-soft: #e2efe1;
    --f-ui: 'Switzer', 'Segoe UI', Arial, sans-serif;
    --f-display: 'General Sans', 'Switzer', 'Segoe UI', Arial, sans-serif;
    --f-mono: 'IBM Plex Mono', Consolas, monospace;
    /* vertical rhythm: English has room to breathe, French runs longer and is set a touch denser */
    --fs: 8.2pt; --lh: 1.42; --fs-side: 7.6pt;
    --stop-gap: 2.5mm; --sec-gap: 5mm; --sk-gap: 2.2mm; --side: 57mm;
  }
  body.fr { --fs: 7.9pt; --lh: 1.39; --fs-side: 7.45pt; --stop-gap: 2.1mm; --sec-gap: 4.6mm; --sk-gap: 1.75mm; }
  html { background: var(--paper); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    width: 210mm; min-height: 297mm; padding: 11mm 12mm 9mm;
    font: 400 var(--fs)/var(--lh) var(--f-ui); color: var(--ink-2); font-variant-ligatures: none; font-kerning: normal;
    /* signature: the day, dawn to night, across the top of the page */
    background:
      linear-gradient(90deg, #e9d1b1, #f1dfc6 12%, #f5e9d7 27%, #f3dcb0 43%, #efbd72 54%, #d98a47 63%, #a65a33 71%, #5b3222 80%, #24170f 89%, #100e0b)
        0 0 / 100% 2.4mm no-repeat,
      var(--paper);
  }
  a { color: inherit; text-decoration: none; }
  strong, b { font-weight: 600; color: var(--ink); }
  p, li { text-wrap: pretty; }
  i.sep { font-style: normal; }
  .nw { white-space: nowrap; }

  /* ---------- header ---------- */
  .hd { display: grid; grid-template-columns: 27mm minmax(0, 1fr) auto; column-gap: 6mm; align-items: center; }
  .ph { width: 27mm; height: 33.75mm; object-fit: cover; border-radius: 1.8mm; }
  h1 { font: 600 25pt/1 var(--f-display); letter-spacing: -0.028em; color: var(--ink); }
  .role { margin-top: 1.5mm; font: 500 15pt/1.1 var(--f-display); letter-spacing: -0.012em; color: var(--bronze); }
  .focus { margin-top: 1.8mm; font: 500 8.6pt/1.3 var(--f-ui); color: var(--ink); }
  .focus .sep { color: var(--gold); font-weight: 700; }
  .facts { margin-top: 2.4mm; font-size: 8pt; line-height: 1.5; color: var(--ink-2); }
  .facts + .facts { margin-top: 0.6mm; color: var(--muted); }
  .facts .sep { color: var(--muted); }
  .st { display: inline-flex; align-items: center; gap: 1.3mm; margin-right: 2.2mm; padding: 0.5mm 2.1mm 0.5mm 1.7mm; border-radius: 9mm; background: var(--ok-soft); color: var(--ok-ink); font-weight: 500; vertical-align: 0.1mm; }
  .st::before { content: ''; width: 1.5mm; height: 1.5mm; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 0.5mm rgba(36, 134, 74, .2); }
  .ct { list-style: none; display: grid; gap: 1.5mm; padding: 1mm 0 1mm 5mm; border-left: 0.25mm solid var(--line); font-size: 7.9pt; color: var(--ink); }
  .ct a { display: flex; align-items: center; gap: 2.1mm; white-space: nowrap; }
  .ct .ic { flex: none; width: 3mm; height: 3mm; color: var(--icon); }
  .sum { margin-top: 5mm; padding-top: 3.2mm; border-top: 0.25mm solid var(--line); font-size: 8.8pt; line-height: 1.45; color: var(--ink-2); }

  /* ---------- body: the thread on the left, the side column on the right ---------- */
  .cols { display: grid; grid-template-columns: minmax(0, 1fr) var(--side); column-gap: 8mm; align-items: start; margin-top: 4.6mm; }
  section + section { margin-top: var(--sec-gap); }
  h2 { display: flex; align-items: center; gap: 2.4mm; height: 4mm; margin-bottom: 2mm; font: 400 7pt/1 var(--f-mono); text-transform: uppercase; color: var(--bronze); }
  h2::after { content: ''; flex: 1; height: 0.25mm; background: var(--line); }

  /* one gold thread through every stop, now at the top, with a knot per stop.
     gut: text indent; tx: thread x; ky: knot centre y in each stop; kb: knot box (the knot is 2.5 mm, the box holds its glow) */
  .main {
    --gut: 6.2mm; --tx: 1.8mm; --ky: 1.55mm; --kb: 3.6mm; --top: calc(6mm + var(--ky));
    --knot-at: calc(var(--tx) - var(--kb) / 2) calc(var(--ky) - var(--kb) / 2) / var(--kb) var(--kb) no-repeat;
    background: linear-gradient(var(--gold), var(--thread) 45%, #b9842a) calc(var(--tx) - 0.2mm) var(--top) / 0.4mm calc(100% - var(--top)) no-repeat;
  }
  .main h2 { margin-left: var(--gut); }
  .stops { list-style: none; }
  .stop { padding-left: var(--gut); background: url("${KNOT}") var(--knot-at); }
  .stop.now { background: url("${KNOT_NOW}") var(--knot-at); }
  .stop + .stop { margin-top: var(--stop-gap); }
  /* the thread ends at the last knot: a strip of paper over it, below that knot */
  .main section:last-child .stop:last-child {
    background: url("${KNOT}") var(--knot-at), linear-gradient(var(--paper), var(--paper)) 0 calc(var(--ky) + 1.3mm) / 3.2mm 100% no-repeat;
  }
  .when { font: 400 6.9pt/1.3 var(--f-mono); color: var(--bronze); white-space: nowrap; }
  .stop h3 { margin-top: 0.3mm; font: 600 10.4pt/1.2 var(--f-display); letter-spacing: -0.008em; color: var(--ink); }
  .edu .stop h3 { font-size: 9.4pt; }
  .stop h3 .fd { font-weight: 500; color: var(--ink-2); }
  .org { margin-top: 0.4mm; color: var(--ink-2); }
  .org .co { font-weight: 500; color: var(--ink); }
  .org .sep { color: var(--muted); }
  .lg { display: inline-flex; align-items: center; justify-content: center; width: ${MARK_SLOT[0]}mm; height: ${MARK_SLOT[1]}mm; margin-right: 1.3mm; vertical-align: -0.6mm; color: var(--ink-2); }
  .mk { display: block; flex: none; overflow: hidden; }
  .mk img { display: block; max-width: none; opacity: .8; }
  .pts { list-style: none; margin-top: 1mm; }
  .pts li { padding-left: 3.4mm; background: linear-gradient(var(--thread), var(--thread)) 0 0.66em / 1.8mm 0.28mm no-repeat; }
  .pts li + li { margin-top: 0.4mm; }
  .stk { margin-top: 1mm; font: 400 6.3pt/1.4 var(--f-mono); color: var(--muted); text-wrap: balance; }
  .aw { margin-top: 0.6mm; }
  .aw em { margin-right: 1mm; font: 400 6.4pt/1 var(--f-mono); font-style: normal; text-transform: uppercase; color: var(--bronze); }

  /* ---------- side column ---------- */
  .side h3 { color: var(--ink); }
  .side { font-size: var(--fs-side); }
  .sg + .sg { margin-top: var(--sk-gap); }
  .sg h3 { margin-bottom: 0.8mm; font: 500 7.5pt/1.2 var(--f-ui); }
  .sk { display: flex; flex-wrap: wrap; gap: 0.9mm 2.5mm; line-height: 1.25; color: var(--ink-2); }
  .sk span { display: inline-flex; align-items: center; gap: 1mm; }
  .sk .ic { flex: none; width: 2.7mm; height: 2.7mm; color: var(--ink-2); }
  .lang { list-style: none; }
  .lang li { display: flex; justify-content: space-between; gap: 3mm; padding: 0.9mm 0; border-top: 0.25mm solid var(--line); }
  .lang li:first-child { border-top: 0; padding-top: 0; }
  .lang b { font-weight: 500; }
  .lang span { color: var(--muted); }
  .pj + .pj { margin-top: 2.2mm; }
  .pj h3 { font: 600 8.8pt/1.2 var(--f-display); }
  .pj .k { margin-left: 1mm; font: 400 6.5pt/1 var(--f-mono); color: var(--bronze); }
  .pj .w { margin-top: 0.3mm; font: 400 6.5pt/1.35 var(--f-mono); color: var(--muted); }
  .pj .w a { color: var(--bronze); text-decoration: underline; text-decoration-thickness: 0.2mm; text-underline-offset: 0.5mm; }
  .pj p + p { margin-top: 0.5mm; }
  .int p + p { margin-top: 0.8mm; }
</style>
</head>
<body class="${lang}">
  <header class="hd">
    <img class="ph" src="${photo}" alt="">
    <div class="id">
      <h1>${esc(p.name)}</h1>
      <p class="role">${t(h.role)}</p>
      <p class="focus">${h.focus.map((f) => t(f)).join(dot)}</p>
      <p class="facts"><span class="st">${t(h.status)}</span><span class="nw">${t(h.experience)}</span></p>
      <p class="facts"><span class="nw">${t(h.location)}</span>${dot}<span class="nw">${t(h.languages)}</span></p>
    </div>
    <ul class="ct">${contacts}</ul>
  </header>
  <p class="sum">${r(p.summary)}</p>
  <div class="cols">
    <main class="main">
      <section class="exp"><h2>${L.experience}</h2><ol class="stops">${experience}</ol></section>
      <section class="edu"><h2>${L.education}</h2><ol class="stops">${education}</ol></section>
    </main>
    <aside class="side">
      <section><h2>${L.skills}</h2>${skills}</section>
      <section><h2>${L.languages}</h2><ul class="lang">${languages}</ul></section>
      <section><h2>${L.projects}</h2>${projects}</section>
      <section class="int"><h2>${L.interests}</h2>
        <p>${t(gamedev)}${lang === 'fr' ? '\u00a0:' : ':'} ${games}${dot}<a href="${esc(social.itch.url)}">${esc(stripProtocol(social.itch.url))}</a></p>
        <p>${hobbies.map((i) => `<span class="nw">${t(i)}</span>`).join(dot)}</p>
      </section>
    </aside>
  </div>
</body>
</html>`;
}

/** Fonts embedded in a PDF written by Chrome, by name (from entries like /BaseFont /AAAAAA+IBMPlexMono-Regular). */
function embeddedFonts(pdf) {
  const names = readFileSync(pdf, 'latin1').match(/\/BaseFont\s*\/[^\s/<>[\]()]+/g) ?? [];
  return new Set(names.map((n) => n.replace(/^\/BaseFont\s*\/(?:[A-Z]{6}\+)?/, '').split('-')[0]));
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
    console.warn(`  ⚠ ${lang} fonts: missing ${missing.join(', ') || 'none'}; fallbacks ${fallbacks.join(', ') || 'none'} (web fonts load from Fontshare and Google Fonts: offline?)`);
  }
  if (keepHtml) console.log(`  html: ${html}`);
}

if (!keepHtml) rmSync(work, { recursive: true, force: true });
