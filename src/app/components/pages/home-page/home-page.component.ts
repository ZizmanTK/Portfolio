import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements AfterViewInit {
  @ViewChild('mainContainer')
  private mainContainer: ElementRef | null = null;
  spotlight: HTMLElement | null = null; //TODO: use angular renderer2 and viewchild instead of direct dom manipulation
  backgroundImage: HTMLElement | null = null;
  private windowResizeTimeout: NodeJS.Timeout | undefined = undefined;
  private windowResizeObserver: ResizeObserver = new ResizeObserver(() => {
    clearTimeout(this.windowResizeTimeout);
    this.windowResizeTimeout = setTimeout(() => {
      this.recenterBackgroundImage();
      this.recenterSpotlight();
    }, 200);
  });
  imageFocused: boolean = false;
  currentProfile = {
    id: 'ZizmanTK',
    image: {
      url: '../../../../assets/images/me_day x400.jpg',
      height: 3414,
      width: 5120,
      eyesX: 2839,
      eyesY: 1133,
      centerX: 2826,
      centerY: 1872,
    },
  };

  ngAfterViewInit(): void {
    this.spotlight = document.querySelector('.spotlight');
    this.backgroundImage = document.querySelector('.background-image');
    if (this.mainContainer?.nativeElement) {
      this.windowResizeObserver?.observe(this.mainContainer.nativeElement);
    }
  }

  /**
   * Update the position of the spotlight when the mouse moves
   * @param event
   * @returns
   */
  moveSpotLight(event: MouseEvent): void {
    const parent = this.mainContainer?.nativeElement;
    if (!this.spotlight || !parent || this.imageFocused) {
      return;
    }
    const parentRect = parent.getBoundingClientRect();
    let x = event.clientX - parentRect.left - this.spotlight.offsetWidth / 2;
    let y = event.clientY - parentRect.top - this.spotlight.offsetHeight / 2;

    this.spotlight.style.transform = `translate(${x}px, ${y}px)`;
  }

  /**
   *
   * @returns
   */
  toggleImageFocus(): void {
    if (!this.mainContainer?.nativeElement) {
      return;
    }
    this.mainContainer?.nativeElement.classList.toggle('image-focus');
    this.imageFocused = !this.imageFocused;

    this.recenterBackgroundImage();
    this.recenterSpotlight();
  }

  focusBackground() {
    let parent = this.mainContainer?.nativeElement;
    if (!this.backgroundImage || !parent) {
      return;
    }
    let minDimension = Math.min(parent.offsetHeight, parent.offsetWidth);
    let newScale = this.fitBackgroundImage({
      targetCenterX: minDimension * 0.5,
      targetCenterY: 0,
      targetWidth: minDimension,
      targetHeight: minDimension,
      imageCenterX: this.currentProfile.image.centerX,
      imageCenterY: 0,
      imageWidth: this.currentProfile.image.width,
      imageHeight: this.currentProfile.image.height,
    });
    let x = minDimension * 0.5 - newScale * this.currentProfile.image.centerX;
    let y = 0;

    this.backgroundImage.style.left = `${x}px`;
    this.backgroundImage.style.top = `${y}px`;
    this.backgroundImage.style.width = `${
      this.currentProfile.image.width * newScale
    }px`;
    this.backgroundImage.style.height = `${
      this.currentProfile.image.height * newScale
    }px`;
  }

  recenterBackgroundImage() {
    let parent = this.mainContainer?.nativeElement;
    if (!this.backgroundImage || !parent) {
      return;
    }
    if (this.imageFocused) {
      this.focusBackground();
      return;
    }
    let fixedPoint = {
      x: this.currentProfile.image.eyesX,
      y: this.currentProfile.image.eyesY,
    };
    let fixedPointTarget = {
      x: parent.offsetWidth * 0.75,
      y: parent.offsetHeight * 0.5,
    };
    if (window.innerHeight > window.innerWidth) {
      fixedPoint = { x: 0, y: 0 };
      fixedPointTarget = { x: 0, y: 0 };
    }

    let newScale = this.fitBackgroundImage({
      targetCenterX: fixedPointTarget.x,
      targetCenterY: fixedPointTarget.y,
      targetWidth: parent.offsetWidth,
      targetHeight: parent.offsetHeight,
      imageCenterX: fixedPoint.x,
      imageCenterY: fixedPoint.y,
      imageWidth: this.currentProfile.image.width,
      imageHeight: this.currentProfile.image.height,
    });
    let x = fixedPointTarget.x - newScale * fixedPoint.x;
    let y = fixedPointTarget.y - newScale * fixedPoint.y;
    console.log(x, y, fixedPointTarget);
    this.backgroundImage.style.left = `${x}px`;
    this.backgroundImage.style.top = `${y}px`;
    this.backgroundImage.style.width = `${
      this.currentProfile.image.width * newScale
    }px`;
    this.backgroundImage.style.height = `${
      this.currentProfile.image.height * newScale
    }px`;
  }

  fitBackgroundImage(args: {
    targetCenterX: number;
    targetCenterY: number;
    targetWidth: number;
    targetHeight: number;
    imageCenterX: number;
    imageCenterY: number;
    imageWidth: number;
    imageHeight: number;
    fitType?: 'contain' | 'cover';
  }): number {
    let finalScale = 0;
    let sLeft = args.targetCenterX / args.imageCenterX;
    let sRight =
      (args.targetWidth - args.targetCenterX) /
      (args.imageWidth - args.imageCenterX);
    let sTop = args.targetCenterY / args.imageCenterY;
    let sBottom =
      (args.targetHeight - args.targetCenterY) /
      (args.imageHeight - args.imageCenterY);
    if (args.fitType === 'contain') {
      finalScale = Math.min(
        ...[sLeft, sRight, sTop, sBottom].filter((scale) =>
          Number.isFinite(scale)
        )
      );
    } else {
      finalScale = Math.max(
        ...[sLeft, sRight, sTop, sBottom].filter((scale) =>
          Number.isFinite(scale)
        )
      );
    }
    return finalScale;
  }

  recenterSpotlight() {
    const parent = this.mainContainer?.nativeElement;
    if (!this.spotlight || !parent) {
      return;
    }

    let xOriginPercent = this.imageFocused ? 0.5 : 0.75;
    let yOriginPercent = 0.5;
    if (window.innerHeight > window.innerWidth && !this.imageFocused) {
      xOriginPercent = yOriginPercent = 0;
    }

    let x =
      xOriginPercent * parent.offsetWidth - this.spotlight.offsetWidth / 2;
    let y =
      yOriginPercent * parent.offsetHeight - this.spotlight.offsetHeight / 2;

    this.spotlight.style.transform = `translate(${x}px, ${y}px)`;
  }
}
