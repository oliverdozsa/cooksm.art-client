import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";
import {RecipeServiceCommonOps} from "./recipe-service-common-ops";
import {TargetIngredients} from "../../data/target-ingredients";
import {DisabledIngredients} from "../../data/ingredients-disabled-states";
import {determineAppSearchMode} from "../../data/saved-recipe-search";
import {AppSearchMode} from "../../data/app-search-mode";

export class WhenSearchModeChangedOps {
  constructor(private snapshotForCurrentQuery: SearchSnapshot, private operation$: Subject<RecipeServiceOperation>) {
  }

  resetPaging() {
    const commonOps = new RecipeServiceCommonOps(this.snapshotForCurrentQuery, this.operation$);
    commonOps.resetPaging();
  }

  disableIngredientsBasedOnSearchMode() {
    this.disableIncluded();
    this.disableExtra();
  }

  private disableIncluded() {
    const appSearchMode = this.determineAppSearchMode();

    let disable: DisabledIngredients = DisabledIngredients.None;
    if (appSearchMode === AppSearchMode.None) {
      disable = DisabledIngredients.NamesAndCategories;
    }

    if (AppSearchMode.StrictlyComposedOf || appSearchMode === AppSearchMode.Contains) {
      disable = DisabledIngredients.Categories;
    }

    this.operation$.next({
      type: RecipeServiceOperationType.DisableIngredients,
      payload: {
        target: TargetIngredients.Included,
        disable: disable
      }
    });
  }

  private disableExtra() {
    const appSearchMode = this.determineAppSearchMode();

    let disable: DisabledIngredients = DisabledIngredients.None;
    if (appSearchMode === AppSearchMode.None || AppSearchMode.StrictlyComposedOf ||
      AppSearchMode.AnyOf) {
      disable = DisabledIngredients.NamesAndCategories;
    }

    this.operation$.next({
      type: RecipeServiceOperationType.DisableIngredients,
      payload: {
        target: TargetIngredients.Extra,
        disable: disable
      }
    });
  }

  private determineAppSearchMode() {
    const query = this.snapshotForCurrentQuery.search.query;
    return determineAppSearchMode(query);
  }
}
