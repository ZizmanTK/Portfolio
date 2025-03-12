import { Component } from '@angular/core';
import { CardData } from '../../ui/card/card.component';
import { TimelineItemData } from '../../ui/timeline-item/timeline-item.component';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent {
  private imagesFolder = './assets/images/';
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
        'I have been playing soccer for as long as I can remember. I am a huge fan of the sport and I am always looking for new ways to improve my game. And yes Messi is the best player in the world.',
    },
    {
      imageUrl: this.imagesFolder + 'piano.png',
      heading: 'Piano',
      details:
        'Playing the piano is one of my favorite hobbies. It is a great way to relax and unwind after a long day. I love learning new songs and challenging myself to improve my skills.',
    },
  ];

  private logosFolder = './assets/logos/';
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
      details: [],
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
      details: [
        'Development of web applications using Angular (front-end) and Django (back-end).',
        'Integration of new features to improve the user interface.',
        'Creation and management of NoSQL databases with MongoDB.',
        'Implementation of unit tests and writing technical documentation to ensure code quality and maintainability.',
      ],
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
      details: [
        'Development of an automated defect detection system based on Python in a demanding industrial environment.',
        'Conducting technological watch on development environments for computer vision solutions.',
      ],
    },
  ];

  education: TimelineItemData[] = [
    {
      title: 'Computer Vision Engineering Degree',
      tag: 'BAC+5',
      organization: {
        name: 'Telecom Physique Strasbourg',
        logo: this.logosFolder + 'tps.svg',
        website: 'https://www.telecom-physique.fr/',
      },
      dates: {
        start: 'September 2020',
        end: 'September 2024',
      },
      location: 'Strasbourg France',
      details: [
        'Specialized training in artificial intelligence, object-oriented programming, software development, and programmable electronics.',
      ],
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
      location: 'Rabat Morocco',
      details: [
        'Intensive training in mathematics and physics, focused on solving complex problems.',
      ],
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

  displayedTimeline = 'experience';
  showTimeline(name: 'experience' | 'education') {
    this.displayedTimeline = name;
  }
}
