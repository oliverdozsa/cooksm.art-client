import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";
import {TargetIngredients} from "../../data/target-ingredients";

export class WhenSnapshotLoadedOps {
  constructor(private snapshot: SearchSnapshot, private operation$: Subject<RecipeServiceOperation>) {
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
}
