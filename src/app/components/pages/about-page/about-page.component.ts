import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardData } from '../../ui/card/card.component';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent implements AfterViewInit {
  private imageFolder = '../../../assets/images/';
  // private cardsElements: HTMLElement[] = [];
  cards: CardData[] = [
    {
      imageUrl: this.imageFolder + 'hinata.png',
      // imageHeight: '23px',
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
      imageUrl: this.imageFolder + '_isagi.png',
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

  // displayedCard: number[] = [0, 1, 2];
  // cardSlotsCoordinates: { left: string; middle: string; right: string } | null =
  //   null;

  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    // const tmp = document.getElementsByClassName('card');
    // for (let i = 0; i < tmp.length; i++) {
    //   this.cardsElements.push(tmp[i] as HTMLElement);
    // }
    // const cardsContainer = document.querySelector('.cards');
    // if (!cardsContainer) {
    //   return;
    // }
    // const center =
    //   cardsContainer.getBoundingClientRect().width / 2 -
    //   this.cardsElements[0].offsetWidth / 2;
    // const offset = this.cardsElements[0].offsetWidth;
    // this.cardSlotsCoordinates = {
    //   left: `${center - offset}px`,
    //   middle: `${center}px`,
    //   right: `${center + offset}px`,
    // };
    // this.cdr.detectChanges();
    // this.showCards();
  }

  showCards() {
    // let left = this.displayedCard[0];
    // let middle = this.displayedCard[1];
    // let right = this.displayedCard[2];
    // this.cardsElements[left].classList.add('card-visible');
    // this.cardsElements[middle].classList.add('card-visible', 'card-focused');
    // this.cardsElements[right].classList.add('card-visible');

    // if (!this.cardSlotsCoordinates) {
    // }
    // // this.cardsElements[middle].style.left = this.cardSlotsCoordinates.middle;
    // // this.cardsElements[left].style.left = this.cardSlotsCoordinates.left;
    // // this.cardsElements[right].style.left = this.cardSlotsCoordinates.right;
    // this.cardsElements[middle].classList.add('card-middle');
    // this.cardsElements[left].classList.add('card-left');
    // this.cardsElements[right].classList.add('card-right');
  }

  hideCards() {
    // for (let card of this.displayedCard) {
    //   this.cardsElements[card].classList.remove(
    //     'card-left',
    //     'card-middle',
    //     'card-right'
    //   );
    // }
  }

  scrollCardsToLeft() {
    // const n = this.cards.length;
    // const middle = (n + this.displayedCard[1] - 1) % n;
    // const left = (n + middle - 1) % n;
    // const right = this.displayedCard[1];
    // this.hideCards();
    // this.displayedCard = [left, middle, right];
    // this.showCards();
  }

  scrollCardsToRight() {}

  scrollCards(index: number) {
    // const n = this.cards.length;
    // let middle = this.displayedCard[1];
    // console.log(index);
    // if (index === 0 && middle === n - 1) {
    //   middle += 1;
    // } else if (index === n - 1 && middle === 0) {
    //   middle -= 1;
    // } else if (index < middle) {
    //   middle -= 1;
    // } else if (index > this.displayedCard[1]) {
    //   middle += 1;
    // } else {
    //   return;
    // }
    // middle = (n + middle) % n;
    // const left = (n + middle - 1) % n;
    // const right = (n + middle + 1) % n;
    // this.hideCards();
    // this.displayedCard = [left, middle, right];
    // this.showCards();
  }
}
