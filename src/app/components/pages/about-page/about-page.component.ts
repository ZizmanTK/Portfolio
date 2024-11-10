import { Component } from '@angular/core';
import { CardData } from '../../ui/card/card.component';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent {
  private imageFolder = '../../../assets/images/';
  cards: CardData[] = [
    {
      imageUrl: this.imageFolder + 'hinata.png',
      heading: 'Volley Ball',
      details:
        'Amateur player, I have powerful spikes and very good defense against tips. During my highshool, I won an interlycée tournament with my school team, playing as main setter (the most strategic position... just saying)'
        + 'And some amateurism text that doesn\' t make any sense but is large and wide enough to give me a good preview of what my things will look like in the context cause I need the text to be fucking long for now. Yet somehow up to this exact moment the text is still not large enough meaning I\'ll have to dig that bastard deeper and deeper and deeper. Yeah I added three consecutive "deeper"s to make the text even longer and larger (and deeper hehehe).',
    },
    {
      imageUrl: this.imageFolder + 'ai.png',
      heading: 'Artificial Intelligence',
      details:
        'Our future is about to get wrecked by AI. Actually it already started. So naturally I want to stay updated about the evolution of this mesmerizing technology.',
    },
    {
      imageUrl: this.imageFolder + 'chess.png',
      heading: 'Chess',
      details:
        'Chess is a very amazing game. It is more a sport than a game though. During a chess game, players heart beat can reach 180 BPM, it is as if they were running a marathon !',
    },
    {
      imageUrl: this.imageFolder + 'isagi.png',
      heading: 'Soccer',
      details:
        'Amateur player, I have powerful spikes and very good defense against tips. During my highshool, I won an interlycée tournament with my school team, playing as main setter (the most strategic position... just saying)',
    },
    {
      imageUrl: this.imageFolder + 'piano.png',
      heading: 'Piano',  
      details:
        'Amateur player, I have powerful spikes and very good defense against tips. During my highshool, I won an interlycée tournament with my school team, playing as main setter (the most strategic position... just saying)',
    },
  ];
}
