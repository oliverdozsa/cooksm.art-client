import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TargetIngredients} from "../../data/target-ingredients";
import {RecipesService} from "../../services/recipes.service";


export enum ConflictResolution {
  LeaveAsItIs,
  Move
}

export class ResolutionAction {
  public leaveAsItIs: () => void = () => {};
  public useNew: () => void = () => {};
}

@Component({
  selector: 'app-ingredients-conflict-modal',
  templateUrl: './ingredients-conflict-modal.component.html',
  styleUrls: ['./ingredients-conflict-modal.component.scss']
})
export class IngredientsConflictModalComponent {
  ConflictResolution = ConflictResolution;

  @Input() target: TargetIngredients | undefined;
  @Input() conflictsWith: TargetIngredients | undefined;
  @Input() resolutionAction: ResolutionAction = new ResolutionAction();

  resolution: ConflictResolution = ConflictResolution.LeaveAsItIs;

  constructor(public activeModal: NgbActiveModal, private recipesService: RecipesService) {
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

  okClicked() {
    this.activeModal.close('Close click');
    if(this.resolution === ConflictResolution.LeaveAsItIs) {
      this.resolutionAction.leaveAsItIs();
    } else {
      this.resolutionAction.useNew();
    }
  }
}
