import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.scss'
})
export class TimelineItemComponent {
  @Input() data!: TimelineItemData
  @HostBinding('class.show-details') showDetails = false;

  toggleDetails(): void {this.showDetails = !this.showDetails}
}


export interface TimelineItemData {
  title: string,
  location: string,
  organization: {
    logo: string,
    name: string,
    website: string,
  },
  details: string[],
  dates: {
    start: string,
    end: string
  }
  tag?: string,
}