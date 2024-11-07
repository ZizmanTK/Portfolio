import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  socials: SocialInfo[] = [
    {
      name: 'Github',
      imageUrl: '../../../../assets/logos/github.svg',
      link: "https://me.com"
    },
    {
      name: 'Itch.io',
      imageUrl: '../../../../assets/logos/itch-io.svg',
      link: "https://me.com"
    },
    {
      name: 'LinkedIn',
      imageUrl: '../../../../assets/logos/linkedin.svg',
      link: "https://me.com"
    },
    {
      name: 'X',
      imageUrl: '../../../../assets/logos/x.svg',
      link: "https://me.com"
    },
    {
      name: 'Youtube',
      imageUrl: '../../../../assets/logos/youtube.svg',
      link: "https://me.com"
    },
  ];
}


interface SocialInfo {
  name: string,
  imageUrl: string,
  link: string,
}