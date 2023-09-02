import {SearchSnapshot} from "../../data/search-snapshot";
import {SearchSnapshotUpdate} from "../../data/search-snapshot-ops/search-snapshot-update";
import {AppSearchMode} from "../../data/app-search-mode";
import {determineAppSearchMode} from "../../data/saved-recipe-search";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";

export class WhenIngredientsChangedOps {
  constructor(private snapshotForCurrentQuery: SearchSnapshot,
              private operation$: Subject<RecipeServiceOperation>) {
  }

  checkIfSearchModeShouldBeUpdated() {
    const query = this.snapshotForCurrentQuery.search.query;
    const isSearchModeNotSet = query.searchMode == undefined;
    const hasIncludedIngredients = query.inIngs != undefined && query.inIngs?.length > 0;

    if (isSearchModeNotSet && hasIncludedIngredients) {
      SearchSnapshotUpdate.withSearchMode(AppSearchMode.Contains, this.snapshotForCurrentQuery);
      this.operation$.next({
        type: RecipeServiceOperationType.SetSearchMode,
        payload: {searchMode: AppSearchMode.Contains}
      });
    }

    if (!isSearchModeNotSet && !hasIncludedIngredients) {
      SearchSnapshotUpdate.withSearchMode(AppSearchMode.None, this.snapshotForCurrentQuery);
      this.operation$.next({
        type: RecipeServiceOperationType.SetSearchMode,
        payload: {searchMode: AppSearchMode.None}
      });
    }
  }

  refreshNumOfGoodIngredientsIfNeeded() {
    const query = this.snapshotForCurrentQuery.search.query
    const appSearchMode = determineAppSearchMode(query);
    if (appSearchMode == AppSearchMode.Contains) {
      query.goodIngs = query.inIngs?.length;
    }
  }

  setDisabledSearchModes() {
    const disabledSearchModes = [];
    const query = this.snapshotForCurrentQuery.search.query;

    const hasNoIngredients = query.inIngs == undefined || query.inIngs.length == 0;
    const hasNoIngredientTags = query.inIngTags == undefined || query.inIngTags.length == 0;

    if(hasNoIngredients && hasNoIngredientTags) {
      disabledSearchModes.push(
        AppSearchMode.AnyOf,
        AppSearchMode.StrictlyComposedOf,
        AppSearchMode.ComposedOf,
        AppSearchMode.Contains
      );
    } else if(hasNoIngredients && !hasNoIngredientTags) {
      disabledSearchModes.push(AppSearchMode.Contains);
    }

    this.operation$.next({
      type: RecipeServiceOperationType.DisableSearchModes,
      payload: disabledSearchModes
    })
  }
}
