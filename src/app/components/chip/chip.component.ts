import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DisabledIngredients} from "../../data/ingredients-disabled-states";

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input() name: string = "";
  @Input() color = "primary";
  @Input() disabled: boolean = false;
  @Output() closeClicked: EventEmitter<void> = new EventEmitter();

  get shouldTextBeLightColored() {
    return this.color == "danger" || this.color == "secondary";
  }
}
