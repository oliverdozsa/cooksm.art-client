import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TargetIngredients} from "../../data/target-ingredients";

@Component({
  selector: 'app-ingredients-conflict-modal',
  templateUrl: './ingredients-conflict-modal.component.html',
  styleUrls: ['./ingredients-conflict-modal.component.scss']
})
export class IngredientsConflictModalComponent {
  @Input() target: TargetIngredients | undefined;
  @Input() conflictsWith: TargetIngredients | undefined;

  constructor(public activeModal: NgbActiveModal) {
  }

  targetToText(target: TargetIngredients | undefined): string {
    if(target === TargetIngredients.Extra) {
      return "extra";
    } else if(target === TargetIngredients.Excluded) {
      return "excluded";
    } else if(target === TargetIngredients.Included) {
      return "included";
    }

    return "<something's wrong>";
  }
}
