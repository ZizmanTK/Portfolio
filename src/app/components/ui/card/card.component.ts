import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() data: CardData = {imageUrl: "", heading:"", details:""}
  @Output() more: EventEmitter<void> = new EventEmitter<void>();
}


export interface CardData {
  imageUrl: string,
  heading: string,
  details: string,
  imageAspectRatio?: string,
  imageHeight?: string
}