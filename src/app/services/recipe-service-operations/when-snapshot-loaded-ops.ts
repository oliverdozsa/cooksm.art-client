import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";
import {TargetIngredients} from "../../data/target-ingredients";
import {DisabledSearchModes} from "./disabled-search-modes";

export class WhenSnapshotLoadedOps {
  private disabledSearchModes: DisabledSearchModes;

  constructor(private snapshot: SearchSnapshot, private operation$: Subject<RecipeServiceOperation>) {
    this.disabledSearchModes = new DisabledSearchModes(snapshot, operation$);
  }

  setIngredients() {
    const query = this.snapshot.search.query;

    this.operation$.next({
      type: RecipeServiceOperationType.SetIngredients,
      payload: {
        target: TargetIngredients.Included,
        ingredients: query.inIngs,
        categories: query.inIngTags
      }
    });

    this.operation$.next({
      type: RecipeServiceOperationType.SetIngredients,
      payload: {
        target: TargetIngredients.Excluded,
        ingredients: query.exIngs,
        categories: query.exIngTags
      }
    });

    this.operation$.next({
      type: RecipeServiceOperationType.SetIngredients,
      payload: {
        target: TargetIngredients.Extra,
        ingredients: query.addIngs,
        categories: query.addIngTags
      }
    });
  }

  setDisabledSearchModes() {
    this.disabledSearchModes.set();
  }
}
