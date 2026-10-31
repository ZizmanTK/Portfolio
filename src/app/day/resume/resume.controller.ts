/**
 * The résumé view, opened by a circle of light from the button that was pressed (and closed back into it). With JS it is
 * a full-screen dialog; without JS it is the end of the page. It scrolls natively: the panel carries
 * data-lenis-prevent, so Lenis (stopped while it is open) leaves its wheel and touch events alone.
 */
import type Lenis from 'lenis';
import { $, $$ } from '../engine/dom';

export interface ResumeController {
  open(e?: Event): void;
  close(e?: Event): void;
  isOpen(): boolean;
  fromUrl(): void;
  destroy(): void;
}

export function resumeController(root: HTMLElement, reduce: boolean, lenis: () => Lenis | null): ResumeController | null {
  const panel = document.getElementById('resume');
  if (!panel) return null;
  let opener: HTMLElement | null = null, settling = 0, closing = 0;
  const offs: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(t: HTMLElement | Document, type: K, f: (e: HTMLElementEventMap[K]) => void) => {
    t.addEventListener(type, f as EventListener);
    offs.push(() => t.removeEventListener(type, f as EventListener));
  };
  panel.classList.add('shut');
  const url = (open: boolean) => {
    const u = new URL(location.href);
    if (open) u.searchParams.set('resume', '');
    else u.searchParams.delete('resume');
    history.replaceState(history.state, '', u.pathname + (open ? '?resume' : u.search));
  };
  // the circle of light grows from (and closes back into) the button that was pressed; the origin is committed with
  // transitions off, so only the radius animates
  const origin = () => {
    const r = opener && opener.isConnected ? opener.getBoundingClientRect() : null;
    panel.style.transition = 'none';
    panel.style.setProperty('--ox', r && r.width ? `${Math.round(r.left + r.width / 2)}px` : '50%');
    panel.style.setProperty('--oy', r && r.height ? `${Math.round(r.top + r.height / 2)}px` : '50%');
    void getComputedStyle(panel).clipPath;
    panel.style.transition = '';
  };
  function open(e?: Event) {
    if (e) { e.preventDefault(); opener = e.currentTarget as HTMLElement; }
    clearTimeout(closing);
    panel!.classList.remove('shut');
    void panel!.offsetWidth; // back in the layout with its closed circle, so the opening animates
    origin();
    panel!.classList.remove('in', 'settled');
    panel!.scrollTop = 0;
    panel!.classList.add('open');
    panel!.setAttribute('role', 'dialog');
    panel!.setAttribute('aria-modal', 'true');
    root.classList.add('rv-open');
    lenis()?.stop();
    // the content comes in once the light is half open; the thread draws down the page
    setTimeout(() => { panel!.focus({ preventScroll: true }); panel!.classList.add('in'); }, reduce ? 0 : 260);
    // once the circle has opened, drop the clip entirely (scrolling a clipped layer costs more)
    clearTimeout(settling);
    settling = window.setTimeout(() => panel!.classList.add('settled'), reduce ? 0 : 1000);
    url(true);
  }
  function close(e?: Event) {
    if (e) e.preventDefault();
    clearTimeout(settling);
    panel!.classList.remove('settled');
    origin();
    panel!.classList.remove('open');
    panel!.removeAttribute('role');
    panel!.removeAttribute('aria-modal');
    root.classList.remove('rv-open');
    lenis()?.start();
    url(false);
    closing = window.setTimeout(() => { panel!.classList.remove('in'); panel!.classList.add('shut'); }, reduce ? 0 : 760);
    const back = opener && opener.isConnected ? opener : $('.bar .resume-open');
    if (back) back.focus({ preventScroll: true });
  }
  // a postcard takes you to its entry, inside the view
  for (const a of $$<HTMLAnchorElement>('.rv-route a', panel)) {
    on(a, 'click', (e) => {
      const t = a.hash ? panel.querySelector<HTMLElement>(a.hash) : null;
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop - 28;
      panel.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      t.classList.remove('rv-flash');
      void t.offsetWidth;
      t.classList.add('rv-flash');
      t.setAttribute('tabindex', '-1');
      setTimeout(() => t.focus({ preventScroll: true }), reduce ? 0 : 500);
    });
  }
  for (const a of $$('.resume-open')) on(a, 'click', (e) => open(e));
  const closer = $('.rv-close', panel);
  if (closer) on(closer, 'click', (e) => close(e));
  on(document, 'keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });
  on(panel, 'keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button', panel).filter((n) => n.offsetParent !== null);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  return {
    open, close,
    isOpen: () => panel.classList.contains('open'),
    fromUrl() { if (new URLSearchParams(location.search).has('resume') || location.hash === '#resume') open(); },
    destroy() {
      clearTimeout(settling);
      clearTimeout(closing);
      offs.forEach((f) => f());
    },
  };
}
