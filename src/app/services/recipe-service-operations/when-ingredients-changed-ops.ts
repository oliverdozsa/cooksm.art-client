import {SearchSnapshot} from "../../data/search-snapshot";
import {SearchSnapshotUpdate} from "../../data/search-snapshot-ops/search-snapshot-update";
import {AppSearchMode} from "../../data/app-search-mode";
import {determineAppSearchMode} from "../../data/saved-recipe-search";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";
import {DisabledSearchModes} from "./disabled-search-modes";
import {RecipeServiceCommonOps} from "./recipe-service-common-ops";

export class WhenIngredientsChangedOps {
  private disabledSearchModes: DisabledSearchModes;

  constructor(private snapshotForCurrentQuery: SearchSnapshot,
              private operation$: Subject<RecipeServiceOperation>) {
    this.disabledSearchModes = new DisabledSearchModes(snapshotForCurrentQuery, operation$);
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
    this.disabledSearchModes.set();
  }

  resetPaging() {
    const commonOps = new RecipeServiceCommonOps(this.snapshotForCurrentQuery, this.operation$);
    commonOps.resetPaging();
  }
}
