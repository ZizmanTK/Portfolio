import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements AfterViewInit {
  spotlight: HTMLElement | null = null;
  backgroundImage: HTMLElement | null = null;
  private timeout: NodeJS.Timeout | undefined = undefined;
  private backgroundResizeObserver: ResizeObserver = new ResizeObserver(() => {
    clearTimeout(this.timeout);
    let xOriginPercent: number;
    if (this.imageFocused) {
      xOriginPercent = 0.5;
    }
    this.timeout = setTimeout(() => {
      this.recenterBackgroundImage();
      this.recenterSpotlight(xOriginPercent);
    }, 200);
  });
  imageFocused: boolean = false;
  currentProfile = {
    id: 'ZizmanTK',
    image: {
      url: '../../../../assets/images/me_day.jpg',
      height: 3414,
      width: 5120,
      eyesX: 2839,
      eyesY: 1133,
      centerX: 2826,
      centerY: 1872,
    },
  };
  // currentProfile = {
  //   id: 'ZizmanTK Damn',
  //   image: {
  //     url: '../../../../assets/images/me_night.jpg',
  //     height: 4017,
  //     width: 3414,
  //     eyesX: 1838,
  //     eyesY: 661,
  //     centerX: 1714,
  //     centerY: 1,
  //   },
  // };
  ngAfterViewInit(): void {
    this.spotlight = document.querySelector('.spotlight');
    this.backgroundImage = document.querySelector('.background-image');
    if (this.backgroundImage) {
      this.backgroundResizeObserver?.observe(this.backgroundImage);
    }
  }

  /**
   * Update the position of the spotlight when the mouse moves
   * @param event
   * @returns
   */
  moveSpotLight(event: MouseEvent): void {
    const parent = this?.spotlight?.parentElement;
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
    if (!this.spotlight?.parentElement) {
      return;
    }
    this.spotlight.parentElement.classList.toggle('image-focus');
    this.imageFocused = !this.imageFocused;
    let xOriginPercent = 0.75 / 2;
    if (this.imageFocused) {
      xOriginPercent = 0.5;
    }

    this.recenterBackgroundImage();
    this.recenterSpotlight(xOriginPercent);
  }

  focusBackground() {
    if (!this.backgroundImage) {
      return;
    }
    let minDimension = Math.min(
      this.backgroundImage.offsetHeight,
      this.backgroundImage.offsetWidth
    );
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
    if (minDimension == this.backgroundImage.offsetHeight) {
      x += (this.backgroundImage.offsetWidth - minDimension) / 2;
    } else {
      y += (this.backgroundImage.offsetHeight - minDimension) / 2;
    }
    this.backgroundImage.style.backgroundPosition = `${x}px ${y}px`;
    this.backgroundImage.style.backgroundSize = `${
      this.currentProfile.image.width * newScale
    }px`;
  }

  recenterBackgroundImage() {
    if (!this.backgroundImage) {
      return;
    }
    if (this.imageFocused) {
      this.focusBackground();
      return;
    }
    let newScale = this.fitBackgroundImage({
      targetCenterX: this.backgroundImage.offsetWidth * 0.75,
      targetCenterY: this.backgroundImage.offsetHeight * 0.5,
      targetWidth: this.backgroundImage.offsetWidth,
      targetHeight: this.backgroundImage.offsetHeight,
      imageCenterX: this.currentProfile.image.eyesX,
      imageCenterY: this.currentProfile.image.eyesY,
      imageWidth: this.currentProfile.image.width,
      imageHeight: this.currentProfile.image.height,
    });
    let x =
      this.backgroundImage.offsetWidth * 0.75 -
      newScale * this.currentProfile.image.eyesX;
    let y =
      this.backgroundImage.offsetHeight * 0.5 -
      newScale * this.currentProfile.image.eyesY;
    this.backgroundImage.style.backgroundPosition = `${x}px ${y}px`;
    this.backgroundImage.style.backgroundSize = `${
      this.currentProfile.image.width * newScale
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
        ...[sLeft, sRight, sTop, sBottom].filter((scale) => !isNaN(scale))
      );
    } else {
      finalScale = Math.max(
        ...[sLeft, sRight, sTop, sBottom].filter((scale) => !isNaN(scale))
      );
    }
    return finalScale;
  }

  recenterSpotlight(
    xOriginPercent: number = 3 / 4,
    yOriginPercent: number = 1 / 2
  ) {
    const parent = this.spotlight?.parentElement;
    if (!this.spotlight || !parent) {
      return;
    }

    let x =
      xOriginPercent * parent.offsetWidth - this.spotlight.offsetWidth / 2;
    let y =
      yOriginPercent * parent.offsetHeight - this.spotlight.offsetHeight / 2;

    this.spotlight.style.transform = `translate(${x}px, ${y}px)`;
  }
}
