import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, Input, Renderer2, TemplateRef } from '@angular/core';
@Component({
  selector: 'app-infinite-scroller',
  templateUrl: './infinite-scroller.component.html',
  styleUrl: './infinite-scroller.component.scss',
})
export class InfiniteScrollerComponent implements AfterViewInit{
  isScrolling: boolean = false;
  @Input() columnsWidth: string = '';

  private startDragX = 0;
  private currentDragX = 0;
  private dragTimeout: NodeJS.Timeout | undefined = undefined;
  
  @ContentChild('contentTemplate') contentTemplateRef!: TemplateRef<any>;

  get el(): HTMLElement {
    return this.hostElementRef.nativeElement.lastChild;
  }
  get widthUnit(): number {
    return (this.el.firstChild as HTMLElement).offsetWidth;
  }
  get nDisplayedElements(): number {
    return Math.round(this.el.offsetWidth / this.widthUnit);
  }

  constructor(
    private hostElementRef: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
      this.renderer.listen(this.el, 'mousedown', (e) => {this.mouseScrollStart(e)})
      this.renderer.listen(this.el, 'mousemove', (e) => {this.mouseScrollProgress(e)})
      this.renderer.listen(this.el, 'mouseleave', () => {this.mouseScrollStop()})
      this.renderer.listen(this.el, 'mouseup', () =>{this.mouseScrollStop()})

      this.renderer.listen(this.el, 'touchstart', () => this.recenterScroller());
      this.renderer.listen(this.el, 'touchmove', () => this.recenterScroller());
      this.renderer.listen(this.el, 'touchup', () => this.recenterScroller());
      this.renderer.listen(this.el, 'touchleave', () => this.recenterScroller());

      const revisedWidth = this.el.offsetWidth/this.nDisplayedElements;
      this.columnsWidth = `${revisedWidth}px`;
      this.cdr.detectChanges()

      this.recenterScroller()
  }
  oneUnitScroll(direction: -1 | 1) {
    this.recenterScroller();
    this.el.scrollTo({
      left: this.widthUnit * (direction + Math.round(this.el.scrollLeft/this.widthUnit)),
      behavior: 'smooth',
    });
  }


  mouseScrollProgress(event: MouseEvent) {
    if (!this.isScrolling) return;
    this.recenterScroller();
    this.renderer.setProperty(
      this.el,
      'scrollLeft',
      this.el.scrollLeft - event.clientX + this.currentDragX
    );
    this.currentDragX = event.clientX;
  }


  mouseScrollStart(event: MouseEvent) {
    clearTimeout(this.dragTimeout);
    this.renderer.removeClass(this.el, 'dragging-stop'); //Cause timeout might not had the time to do it
    this.renderer.addClass(this.el, 'dragging-start')
    this.isScrolling = true;
    this.currentDragX = this.startDragX = event.clientX;
  }

  mouseScrollStop() {
    if (!this.isScrolling) return;
    let newScrollLeft
    if (Math.abs(this.currentDragX - this.startDragX) < 10) {
      newScrollLeft = this.widthUnit * Math.round(this.el.scrollLeft / this.widthUnit);
    } else if (this.currentDragX > this.startDragX) {
      newScrollLeft = this.widthUnit * Math.floor(this.el.scrollLeft / this.widthUnit);
    } else {
      newScrollLeft = this.widthUnit * Math.ceil(this.el.scrollLeft / this.widthUnit);
    }
    this.isScrolling = false;
    this.renderer.removeClass(this.el, 'dragging-start')
    this.renderer.addClass(this.el, 'dragging-stop');
    this.el.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    this.dragTimeout = setTimeout(() => {
      this.renderer.removeClass(this.el, 'dragging-stop');
    }, 5000);
  }

  recenterScroller() {
    if (this.el.scrollLeft < 5) {
      this.el.scrollBy({ left: this.el.scrollWidth / 2, behavior: 'instant' });
    } else if (
      this.el.scrollLeft + 5 >
      this.el.scrollWidth - this.nDisplayedElements * this.widthUnit
    ) {
      this.el.scrollBy({ left: -this.el.scrollWidth / 2, behavior: 'instant' });
    }
  }
}
