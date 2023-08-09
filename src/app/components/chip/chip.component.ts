import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input() name: string = "";
  @Input() color = "primary";
  @Output() closeClicked: EventEmitter<void> = new EventEmitter()
}
