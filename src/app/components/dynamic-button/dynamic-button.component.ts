import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dynamic-button',
  imports: [],
  templateUrl: './dynamic-button.component.html',
  styleUrl: './dynamic-button.component.css'
})
export class DynamicButtonComponent {
  @Output() submitClicked = new EventEmitter<void>();

  submit() {
    this.submitClicked.emit();
  }

}
