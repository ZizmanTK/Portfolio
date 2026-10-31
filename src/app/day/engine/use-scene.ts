import { ElementRef, inject } from '@angular/core';
import { DayEngine } from './engine';
import type { Ctx, Scene } from './scene';

/**
 * Called from a set piece's constructor: hands the engine the scene that animates this component's markup. The engine
 * creates it in the browser only, once the page is hydrated, fonts and images are in, and the viewport has a size.
 */
export function useScene(make: (host: HTMLElement, ctx: Ctx) => Scene | Scene[] | null): void {
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  inject(DayEngine).register(host, (ctx) => make(host, ctx));
}

/** "stop 02 / 10 · 06:30 · Niamey, Niger" */
export const stopLabel = (word: string, n: number, time: string, place: string): string =>
  `${word} ${String(n).padStart(2, '0')} / 10 · ${time} · ${place}`;
