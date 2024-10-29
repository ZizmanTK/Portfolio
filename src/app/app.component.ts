import { Component } from '@angular/core';
import { NavbarMenu } from './components/ui/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  navbarMenus: NavbarMenu[] = [
    { name: 'About', toUrl: '' },
    { name: 'Projects', toUrl: '' },
    { name: 'Contact', toUrl: '' },
  ];
  title = 'front';
}
