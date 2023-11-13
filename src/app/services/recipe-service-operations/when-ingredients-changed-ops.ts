import {SearchSnapshot} from "../../data/search-snapshot";
import {SearchSnapshotUpdate} from "../../data/search-snapshot-ops/search-snapshot-update";
import {AppSearchMode} from "../../data/app-search-mode";
import {determineAppSearchMode} from "../../data/saved-recipe-search";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";
import {DisabledSearchModes} from "./disabled-search-modes";
import {RecipeServiceCommonOps} from "./recipe-service-common-ops";
import {WhenIngredientsChangedHandleExtraRelationsOps} from "./when-ingredients-changed-handle-extra-relations-ops";
import {WhenSearchModeChangedOps} from "./when-search-mode-changed-ops";

export class WhenIngredientsChangedOps {
  private disabledSearchModes: DisabledSearchModes;

  constructor(private snapshotForCurrentQuery: SearchSnapshot,
              private operation$: Subject<RecipeServiceOperation>,
              private previousSnapshot: SearchSnapshot) {
    this.disabledSearchModes = new DisabledSearchModes(snapshotForCurrentQuery, operation$);
  }

  doWhatNecessary() {
    this.checkIfSearchModeShouldBeUpdated();
    this.refreshNumOfGoodIngredientsIfNeeded();
    this.setDisabledSearchModes();
    this.resetPaging();
    this.handleExtraRelationAdjustments();
  }

  checkIfSearchModeShouldBeUpdated() {
    const query = this.snapshotForCurrentQuery.search.query;
    const isSearchModeNotSet = query.searchMode == undefined;
    const hasIncludedIngredients = query.inIngs != undefined && query.inIngs?.length > 0;

    const previousQuery = this.previousSnapshot.search.query;
    const hadNoIngredientsPreviously =
      (previousQuery.inIngs === undefined || previousQuery.inIngs.length === 0) &&
      (previousQuery.inIngTags === undefined || previousQuery.inIngTags.length === 0)

    const whenSearchModeChanged = new WhenSearchModeChangedOps(
      this.snapshotForCurrentQuery, this.operation$
    );

    if ((isSearchModeNotSet || hadNoIngredientsPreviously) && hasIncludedIngredients) {
      SearchSnapshotUpdate.withSearchMode(AppSearchMode.Contains, this.snapshotForCurrentQuery);
      this.operation$.next({
        type: RecipeServiceOperationType.SetSearchMode,
        payload: {searchMode: AppSearchMode.Contains, ratio: this.snapshotForCurrentQuery.search.query.goodIngsRatio}
      });

      whenSearchModeChanged.disableIngredientsBasedOnSearchMode();
    }

    if (!isSearchModeNotSet && !hasIncludedIngredients) {
      SearchSnapshotUpdate.withSearchMode(AppSearchMode.None, this.snapshotForCurrentQuery);
      this.operation$.next({
        type: RecipeServiceOperationType.SetSearchMode,
        payload: {searchMode: AppSearchMode.None, ratio: this.snapshotForCurrentQuery.search.query.goodIngsRatio}
      });

      whenSearchModeChanged.disableIngredientsBasedOnSearchMode();
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

  handleExtraRelationAdjustments() {
    const handleOps =
      new WhenIngredientsChangedHandleExtraRelationsOps(this.snapshotForCurrentQuery, this.operation$);
    handleOps.handleExtraRelationAdjustments();
  }
}
