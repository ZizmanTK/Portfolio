import { Component } from '@angular/core';
import { NavbarMenu } from './components/ui/navbar/navbar.component';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(library: FaIconLibrary){
    library.addIconPacks(fas, far, fab)
  }
  navbarMenus: NavbarMenu[] = [
    { name: 'About', toUrl: 'about' },
    { name: 'Projects', toUrl: 'projects' },
    { name: 'Contact', toUrl: 'contact' },
  ];
  title = 'front';
}
