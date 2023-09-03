import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";
import {AppSearchMode} from "../../data/app-search-mode";

export class DisabledSearchModes {
  constructor(private snapshotForCurrentQuery: SearchSnapshot,
              private operation$: Subject<RecipeServiceOperation>) {
  }

  set() {
    const disabledSearchModes = [];
    const query = this.snapshotForCurrentQuery.search.query;

    const hasNoIngredients = query.inIngs == undefined || query.inIngs.length == 0;
    const hasNoIngredientTags = query.inIngTags == undefined || query.inIngTags.length == 0;

    if (hasNoIngredients && hasNoIngredientTags) {
      disabledSearchModes.push(
        AppSearchMode.AnyOf,
        AppSearchMode.StrictlyComposedOf,
        AppSearchMode.ComposedOf,
        AppSearchMode.Contains
      );
    } else if (hasNoIngredients && !hasNoIngredientTags) {
      disabledSearchModes.push(AppSearchMode.Contains);
    }

    this.operation$.next({
      type: RecipeServiceOperationType.DisableSearchModes,
      payload: disabledSearchModes
    })
  }
}
