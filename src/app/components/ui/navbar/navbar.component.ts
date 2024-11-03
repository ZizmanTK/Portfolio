import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() menus: NavbarMenu[] = []
  
  @ViewChild('topContainer')
  private topContainer: ElementRef | null = null

  constructor(private renderer: Renderer2) {}
  toggleHamburgerMenu() {
    const navbar = this.topContainer?.nativeElement
    if (!navbar) {
      return;
    }
    if (navbar.classList.contains('hamburger-menu__opened')) {
      this.renderer.removeClass(navbar, 'hamburger-menu__opened');
    } else {
      this.renderer.addClass(navbar, 'hamburger-menu__opened');
    }
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
