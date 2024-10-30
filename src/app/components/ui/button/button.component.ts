import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements AfterViewInit {
  @Input() color: 'primary' | 'secondary' | 'accent' | 'none' = 'primary';
  buttonClasses = {}

  ngAfterViewInit(): void {
      this.buttonClasses = {
        'button-primary': this.color == 'primary',
        'button-secondary': this.color == 'secondary',
        'button-accent': this.color == 'accent',
      };
  }
}
