import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @HostBinding('class.hamburger-menu__opened') hamburgerMenuOpened = false;
  @Input() menus: NavbarMenu[] = [];

  toggleHamburgerMenu() {
    this.hamburgerMenuOpened = !this.hamburgerMenuOpened;
  }
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
