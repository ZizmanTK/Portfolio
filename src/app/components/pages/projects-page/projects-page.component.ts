import { Component } from '@angular/core';
import { ProjectData } from '../../ui/project-card/project-card.component';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
})
export class ProjectsPageComponent {
  projects: ProjectData[] = [
    {
      name: 'Roll Power',
      imageUrl: '../../../../assets/images/roll-power.png',
      tags: ['Unity', 'Fl Studio', 'GMTK Game Jam'],
      category: 'Game Development',
      links: { website: '', github: '', itchio: '' },
      shortDescription: "Use your rolling supperpower to clean up the bombs before they explode !",
      detailedDescription:
        'This game was developped during the GMTK Gam Jam. It is a yearly competition where competitors have 2 days to build a game based on a specific theme. The theme this game was build on is «The roll of the dice».',
      
    },
    {
      name: 'REMIND',
      imageUrl: '../../../../assets/images/remind.png',
      tags: ['Angular', 'Django', 'MongoDB', 'Docker', 'MySQL', 'Scikit-learn'],
      category: 'Web Development',
      links: { website: '', github: '', itchio: '' },
      shortDescription: "Apply advanced Machine Learning algorithms to your materials data !",
      detailedDescription:
        'This application allow the user to import a database from a file (excel, csv) or from the Bassetti Application TEEXMA, and apply Machine Learning algorithms including prediction, anomaly detection and clustering algorithms. It has also features for quickly visualizing statistics of the database such as histogram of values, correlation matrix, boxplot ...',
      
    },
    {
      name: 'TxBot',
      imageUrl: '../../../../assets/images/txbot.png',
      tags: ['Angular', 'Django', 'Langchain', 'MySQL'],
      category: 'AI Assistant',
      links: { website: '', github: '', itchio: '' },
      shortDescription: "Use your rolling supperpower to clean up the bombs before they explode !",
      detailedDescription:
        'This game was developped during the GMTK Gam Jam. It is a yearly competition where competitors have 2 days to build a game based on a specific theme. The theme this game was build on is «The roll of the dice».',
      
    },
    {
      name: 'CoilCheck',
      imageUrl: '../../../../assets/images/coil-check.jpg',
      tags: ['Tensorflow', 'Anomaly Detection','Picsellia', 'Visionnairy', 'Anomalib'],
      category: 'Computer Vision',
      links: { website: '', github: '', itchio: '' },
      shortDescription: "Detect defects on coils before packaging !",
      detailedDescription:
        'This game was developped during the GMTK Gam Jam. It is a yearly competition where competitors have 2 days to build a game based on a specific theme. The theme this game was build on is «The roll of the dice».',
      
    },
    {
      name: 'ZTKtris Unforgivable',
      imageUrl: '../../../../assets/images/tetris.png',
      tags: ['Unity', 'Fl Studio'],
      category: 'Game Development',
      links: { website: '', github: '', itchio: '' },
      shortDescription: "A tetris remake where mistakes are not forgiven !",
      detailedDescription:
        'This game is a personal project of mine. The purpose of building that game was to apply the things I learned about unity in a real project that I would finish from A to Z. The trashy music is also from me created with fl studio.',
      
    },
        {
      name: 'Portfolio',
      imageUrl: '../../../../assets/images/portfolio.png',
      tags: ['Angular', 'Adobe Illustrator'],
      category: 'Web Design | Development',
      links: { website: '', github: '', itchio: '' },
      shortDescription: "You are looking at it !",
      detailedDescription:
        'This game is a personal project of mine. The purpose of building that game was to apply the things I learned about unity in a real project that I would finish from A to Z. The trashy music is also from me created with fl studio.',
      
    },
  ];


  currentProject: ProjectData = this.projects[0];
}



