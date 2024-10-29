import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() menus: NavbarMenu[] = []
  

}

/**
 * Represents an option of the navbar
 */
export interface NavbarMenu {
  /**
   * Displayed name
   */
  name: string,
  /**
   * Url that the menu redirects to
   */
  toUrl: string 
}
