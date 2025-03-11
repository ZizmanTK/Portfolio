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
      link: 'https://github.com/ZizmanTK',
    },
    {
      name: 'Itch.io',
      imageUrl: '../../../../assets/logos/itch-io.svg',
      link: 'https://zizmantk.itch.io/',
    },
    {
      name: 'LinkedIn',
      imageUrl: '../../../../assets/logos/linkedin.svg',
      link: 'https://www.linkedin.com/in/abdoul-aziz-maazou/',
    },
    {
      name: 'X',
      imageUrl: '../../../../assets/logos/x.svg',
      link: 'https://x.com/manomi_aziz',
    },
    {
      name: 'Youtube',
      imageUrl: '../../../../assets/logos/youtube.svg',
      link: 'https://www.youtube.com/@zizmantk9271',
    },
  ];
}


interface SocialInfo {
  name: string,
  imageUrl: string,
  link: string,
}