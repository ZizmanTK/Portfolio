import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements AfterViewInit {
  @Input() color: 'primary' | 'secondary' | 'accent' | 'none' = 'primary';
  @Output() clicked = new EventEmitter<MouseEvent>();
  buttonClasses = {}

  ngAfterViewInit(): void {
      this.buttonClasses = {
        'button-primary': this.color == 'primary',
        'button-secondary': this.color == 'secondary',
        'button-accent': this.color == 'accent',
      };
  }
}
