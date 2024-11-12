import { Component } from '@angular/core';
import { CardData } from '../../ui/card/card.component';
import { TimelineItemData } from '../../ui/timeline-item/timeline-item.component';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent {
  private imagesFolder = '../../../assets/images/';
  cards: CardData[] = [
    {
      imageUrl: this.imagesFolder + 'hinata.png',
      heading: 'Volley Ball',
      details:
        'Amateur player, I have powerful spikes and very good defense against tips. During my highshool, I won an interlycée tournament with my school team, playing as main setter (the most strategic position... just saying)' +
        'And some amateurism text that doesn\' t make any sense but is large and wide enough to give me a good preview of what my things will look like in the context cause I need the text to be fucking long for now. Yet somehow up to this exact moment the text is still not large enough meaning I\'ll have to dig that bastard deeper and deeper and deeper. Yeah I added three consecutive "deeper"s to make the text even longer and larger (and deeper hehehe).',
    },
    {
      imageUrl: this.imagesFolder + 'ai.png',
      heading: 'Artificial Intelligence',
      details:
        'Our future is about to get wrecked by AI. Actually it already started. So naturally I want to stay updated about the evolution of this mesmerizing technology.',
    },
    {
      imageUrl: this.imagesFolder + 'chess.png',
      heading: 'Chess',
      details:
        'Chess is a very amazing game. It is more a sport than a game though. During a chess game, players heart beat can reach 180 BPM, it is as if they were running a marathon !',
    },
    {
      imageUrl: this.imagesFolder + 'isagi.png',
      heading: 'Soccer',
      details:
        'Amateur player, I have powerful spikes and very good defense against tips. During my highshool, I won an interlycée tournament with my school team, playing as main setter (the most strategic position... just saying)',
    },
    {
      imageUrl: this.imagesFolder + 'piano.png',
      heading: 'Piano',
      details:
        'Amateur player, I have powerful spikes and very good defense against tips. During my highshool, I won an interlycée tournament with my school team, playing as main setter (the most strategic position... just saying)',
    },
  ];

  private logosFolder = '../../../assets/logos/';
  workExperience: TimelineItemData[] = [
    {
      title: 'R&I Developer',
      tag: 'FIXED-TERM',
      organization: {
        name: 'Bassetti Group',
        logo: this.logosFolder + 'bassetti-group.svg',
        website: 'https://www.bassetti-group.com/',
      },
      dates: {
        start: 'September 2024',
        end: 'Now',
      },
      location: 'Grenoble France',
      details: ['abcdlajmrjle', 'And another gibberish'],
    },
    {
      title: 'R&I Developer',
      tag: 'INTERNSHIP',
      organization: {
        name: 'Bassetti Group',
        logo: this.logosFolder + 'bassetti-group.svg',
        website: 'https://www.bassetti-group.com/',
      },
      dates: {
        start: 'February 2024',
        end: 'August 2024',
      },
      location: 'Grenoble France',
      details: ['abcdlajmrjle', 'And another gibberish'],
    },
    {
      title: 'Computer Vision Engineer',
      tag: 'INTERNSHIP',
      organization: {
        name: 'ArcelorMittal France',
        logo: this.logosFolder + 'arcelormittal.svg',
        website: 'https://france.arcelormittal.com/',
      },
      dates: {
        start: 'March 2023',
        end: 'August 2023',
      },
      location: 'Uckange France',
      details: ['abcdlajmrjle', 'And another gibberish'],
    },
  ];

  education: TimelineItemData[] = [
    {
      title: 'Computer Vision Engineering Degree',
      tag: 'BAC+5',
      organization: {
        name: 'Telecom Physique Strasbourg',
        logo: this.logosFolder + 'tps.png',
        website: 'https://www.telecom-physique.fr/',
      },
      dates: {
        start: 'September 2020',
        end: 'September 2024',
      },
      location: 'Strasbourg France',
      details: ['abcdlajmrjle', 'And another gibberish'],
    },
    {
      title: 'Preparatory Class',
      tag: 'CPGE',
      organization: {
        name: 'Ibn Ghazi',
        logo: this.logosFolder + 'ibn-ghazi.svg',
        website: 'https://ibnghazicpge.ac.ma/',
      },
      dates: {
        start: 'September 2018',
        end: 'July 2020',
      },
      location: 'Rabat Maroc',
      details: ['abcdlajmrjle', 'And another gibberish'],
    },
    // {
    //   title: 'Computer Vision Engineer',
    //   tag: 'internship',
    //   organization: {
    //     name: 'ArcelorMittal France',
    //     logo: this.logosFolder + 'arcelormittal.svg',
    //     website: 'https://france.arcelormittal.com/',
    //   },
    //   dates: {
    //     start: 'March 2023',
    //     end: 'August 2023',
    //   },
    //   location: 'Uckange France',
    //   details: ['abcdlajmrjle', 'And another gibberish'],
    // },
  ];
}
