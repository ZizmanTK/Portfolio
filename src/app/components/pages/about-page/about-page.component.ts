import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {

  moveSpotLight(event: MouseEvent) {

      const spotlight = document?.getElementById('spotlight');
      const parent = document?.querySelector('.presentation');
      if (!parent || !spotlight) {return}
      const parentRect = parent.getBoundingClientRect();

      const x = event.clientX - parentRect.left - spotlight.offsetWidth / 2;
      const y = event.clientY - parentRect.top - spotlight.offsetHeight / 2;

      spotlight.style.transform = `translate(${x}px, ${y}px)`;
  }
}
