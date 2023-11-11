import {TargetIngredients} from "../../data/target-ingredients";
import {DisplayedIngredient} from "../../data/displayed-ingredient";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  IngredientsConflictModalComponent,
  ResolutionAction
} from "../../components/ingredients-conflict-modal/ingredients-conflict-modal.component";
import {RecipeServiceOperationType} from "../recipe-service-operation";
import {RecipesService} from "../recipes.service";
import {SearchSnapshot} from "../../data/search-snapshot";
import {SearchSnapshotTransform} from "../../data/search-snapshot-ops/search-snapshot-transform";

export class IngredientAlreadyPresentElsewhereChecker {
  private ingredientsByTarget: Map<TargetIngredients, DisplayedIngredient[]> =
    new Map<TargetIngredients, DisplayedIngredient[]>();

  private lastModifiedTarget: TargetIngredients | undefined;
  private foundInTarget: TargetIngredients | undefined;
  private duplicates: DisplayedIngredient[] = [];

  constructor(private modalService: NgbModal, private recipesService: RecipesService, snapshot: SearchSnapshot) {
    const displayedIngredientsOfSnapshot = SearchSnapshotTransform.toDisplayedIngredients(snapshot);

    this.ingredientsByTarget.set(TargetIngredients.Included, displayedIngredientsOfSnapshot.get(TargetIngredients.Included)!);
    this.ingredientsByTarget.set(TargetIngredients.Excluded, displayedIngredientsOfSnapshot.get(TargetIngredients.Excluded)!);
    this.ingredientsByTarget.set(TargetIngredients.Extra, displayedIngredientsOfSnapshot.get(TargetIngredients.Extra)!);
  }

  findWhenIngredientsChangedIn(target: TargetIngredients, items: DisplayedIngredient[]): boolean {
    this.duplicates = [];
    this.foundInTarget = undefined;

    this.ingredientsByTarget.set(target, items);
    this.lastModifiedTarget = target;
    return this.find(target);
  }

  askUser() {
    const modalRef = this.modalService.open(IngredientsConflictModalComponent);
    modalRef.componentInstance.target = this.lastModifiedTarget;
    modalRef.componentInstance.conflictsWith = this.foundInTarget;

    const resolutionAction = new ResolutionAction();
    resolutionAction.leaveAsItIs = () => this.resolveByLeavingAsItIs();
    resolutionAction.useNew = () => this.resolveByUsingNew();

    modalRef.componentInstance.resolutionAction = resolutionAction;
  }

  private find(withLastModified: TargetIngredients): boolean {
    const allTargets = [TargetIngredients.Included, TargetIngredients.Excluded, TargetIngredients.Extra];
    const targetsToCheck = allTargets.filter(t => t != withLastModified, allTargets);

    for (let targetToCheck of targetsToCheck) {
      this.findDuplicates(targetToCheck, this.ingredientsByTarget.get(withLastModified)!);
      if (this.duplicates.length > 0) {
        this.foundInTarget = targetToCheck;
        return true;
      }
    }

    return false;
  }

  private resolveByLeavingAsItIs() {
    const lastModifiedWithoutDuplicates = this.ingredientsByTarget
      .get(this.lastModifiedTarget!)!
      .filter(i => !this.isPresentIn(this.duplicates, i));
    this.ingredientsByTarget.set(this.lastModifiedTarget!, lastModifiedWithoutDuplicates);

    this.recipesService.operation$.next({
      type: RecipeServiceOperationType.SetDisplayedIngredients,
      payload: {
        target: this.lastModifiedTarget,
        ingredients: lastModifiedWithoutDuplicates
      }
    });
  }

  private resolveByUsingNew() {
    const foundWithoutDuplicates = this.ingredientsByTarget
      .get(this.foundInTarget!)!
      .filter(i => !this.isPresentIn(this.duplicates, i));
    this.ingredientsByTarget.set(this.foundInTarget!, foundWithoutDuplicates);

    this.recipesService.operation$.next({
      type: RecipeServiceOperationType.SetDisplayedIngredients,
      payload: {
        target: this.foundInTarget,
        ingredients: foundWithoutDuplicates
      }
    });

    this.recipesService.updateWithIngredients(this.ingredientsByTarget);
  }

  private findDuplicates(target: TargetIngredients, sourceItems: DisplayedIngredient[]): void {
    const targetDisplayedIngredients = this.ingredientsByTarget.get(target)!;
    for (let sourceItem of sourceItems) {
      if (this.isPresentIn(targetDisplayedIngredients, sourceItem)) {
        this.duplicates = this.duplicates.concat(sourceItem);
      }
    }
  }

  private isPresentIn(target: DisplayedIngredient[], item: DisplayedIngredient): boolean {
    return target.find(t => t.equals(item)) != undefined;
  }
}
