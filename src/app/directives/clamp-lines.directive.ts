import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClampLines]'
})
export class ClampLinesDirective implements AfterViewInit, OnDestroy{
  private resizeObserver: ResizeObserver | null = null

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'app-clamp-lines'); //This class should be defined in styles.scss ; using class allows for lower specificity and better flexibility
    this.resizeObserver = new ResizeObserver(() => {
      this.updateTextBox()
    });
    this.resizeObserver.observe(this.el.nativeElement); 
  }

  updateTextBox() {
    const style = window.getComputedStyle(this.el.nativeElement);
    const availableSpace = parseInt(style.height);
    let lineHeight = parseInt(style.lineHeight);
    if (isNaN(lineHeight)) {
      lineHeight = 1.2*parseInt(style.fontSize)
    }
    const maxLines = Math.floor(availableSpace / lineHeight);
    this.renderer.setStyle(
      this.el.nativeElement,
      '--max-lines',
      `${maxLines}`,
      2
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      '--cropped-height',
      `${lineHeight * maxLines}px`,
      2
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      'line-height',
      `${lineHeight}px`
    ); //Setting the line-height to avoid cutting bottom of characters when the line-height is calculated as 1.2*fong-size
  }


  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
  }
}
