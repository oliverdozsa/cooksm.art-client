import {TargetIngredients} from "../../data/target-ingredients";
import {DisplayedIngredient} from "../../data/displayed-ingredient";
import {SearchSnapshot} from "../../data/search-snapshot";
import {IngredientCategory, IngredientName} from "../../data/ingredients";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  IngredientsConflictModalComponent
} from "../../components/ingredients-conflict-modal/ingredients-conflict-modal.component";
import {RecipesService} from "../recipes.service";
import {RecipeServiceOperationType} from "../recipe-service-operation";

export class IngredientAlreadyPresentElsewhereChecker {
  constructor(private snapshot: SearchSnapshot, private target: TargetIngredients, private items: DisplayedIngredient[],
              private modalService: NgbModal, private recipesService: RecipesService) {
  }

  private foundInTarget: TargetIngredients | undefined;
  private duplicates: DisplayedIngredient[] = [];

  find(): boolean {
    const allTargets = [TargetIngredients.Included, TargetIngredients.Excluded, TargetIngredients.Extra];
    const targetsToCheck = allTargets.filter(t => t != this.target, allTargets);

    for (let targetToCheck of targetsToCheck) {
      this.findDuplicates(targetToCheck, this.items);
      if (this.duplicates.length > 0) {
        this.foundInTarget = targetToCheck;
        return true;
      }
    }

    return false;
  }

  askUser() {
    const modalRef = this.modalService.open(IngredientsConflictModalComponent);
    modalRef.componentInstance.target = this.target;
    modalRef.componentInstance.conflictsWith = this.foundInTarget;
  }

  resolveByLeavingAsItIs() {
    this.filterDuplicatesFrom(this.target);

    this.recipesService.operation$.next({
      type: RecipeServiceOperationType.SetDisplayedIngredients,
      payload: {
        target: this.target,
        displayedIngredients: this.displayedIngredientsOf(this.target)
      }
    })
  }

  resolveByUsingNew() {
    this.filterDuplicatesFrom(this.foundInTarget!);
    this.recipesService.ingredientsChangedIn(this.target, this.displayedIngredientsOf(this.target));
  }

  private findDuplicates(target: TargetIngredients, sourceItems: DisplayedIngredient[]): void {
    const targetDisplayedIngredients = this.displayedIngredientsOf(target);
    for (let sourceItem of sourceItems) {
      if (this.isPresentIn(targetDisplayedIngredients, sourceItem)) {
        this.duplicates = this.duplicates.concat(sourceItem);
      }
    }
  }

  private displayedIngredientsOf(target: TargetIngredients): DisplayedIngredient[] {
    const query = this.snapshot.search.query;

    let ingredientsToUse: IngredientName[] | undefined;
    let categoriesToUse: IngredientCategory[] | undefined;

    if (target === TargetIngredients.Included) {
      ingredientsToUse = query.inIngs;
      categoriesToUse = query.inIngTags;
    } else if(target === TargetIngredients.Excluded) {
      ingredientsToUse = query.exIngs;
      categoriesToUse = query.exIngTags;
    } else if(target === TargetIngredients.Extra) {
      ingredientsToUse = query.addIngs;
      categoriesToUse = query.addIngTags;
    }

    let ingredientsAsDisplayedIngredients = ingredientsToUse != undefined ? ingredientsToUse.map(i => DisplayedIngredient.fromIngredientName(i)) : [];
    let categoriesAsDisplayedIngredients = categoriesToUse != undefined ? categoriesToUse.map(t => DisplayedIngredient.fromIngredientCategory(t)) : [];

    return ingredientsAsDisplayedIngredients.concat(categoriesAsDisplayedIngredients);
  }

  private isPresentIn(target: DisplayedIngredient[], item: DisplayedIngredient): boolean {
    return target.find(t => t.equals(item)) != undefined;
  }

  private filterDuplicatesFrom(target: TargetIngredients) {
    // TODO
  }
}
