import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
@Input() data!: ProjectData
}

export interface ProjectData {
  imageUrl: string,
  name: string,
  tags: string[],
  category: string,
  shortDescription: string,
  detailedDescription: string,
  links?: {
    github?: string,
    website?: string,
    itchio?: string,
    youtube?: string,
  }
}