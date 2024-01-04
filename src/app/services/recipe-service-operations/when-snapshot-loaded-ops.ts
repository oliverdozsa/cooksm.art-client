import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";
import {TargetIngredients} from "../../data/target-ingredients";
import {DisabledSearchModes} from "./disabled-search-modes";
import {WhenIngredientsChangedHandleExtraRelationsOps} from "./when-ingredients-changed-handle-extra-relations-ops";
import {determineAppSearchMode} from "../../data/saved-recipe-search";
import {WhenSearchModeChangedOps} from "./when-search-mode-changed-ops";
import {UserService} from "../user.service";

export class WhenSnapshotLoadedOps {
  private disabledSearchModes: DisabledSearchModes;

  constructor(private snapshot: SearchSnapshot, private operation$: Subject<RecipeServiceOperation>,
              private userService: UserService) {
    this.disabledSearchModes = new DisabledSearchModes(snapshot, operation$);
  }

  doWhatNecessary() {
    this.setIngredients();
    this.setDisabledSearchModes();
    this.setOrderingAndFilters();
    this.handleExtraRelationAdjustments();
    this.setSearchMode();
    this.setPageNumber();

    const whenSearchModeChanged =
      new WhenSearchModeChangedOps(this.snapshot, this.operation$);
    whenSearchModeChanged.disableIngredientsBasedOnSearchMode();
  }

  setIngredients() {
    const query = this.snapshot.search.query;

    this.operation$.next({
      type: RecipeServiceOperationType.SetIngredients,
      payload: {
        target: TargetIngredients.Included,
        ingredients: query.inIngs ? query.inIngs : [],
        categories: query.inIngTags ? query.inIngTags : []
      }
    });

    this.operation$.next({
      type: RecipeServiceOperationType.SetIngredients,
      payload: {
        target: TargetIngredients.Excluded,
        ingredients: query.exIngs ? query.exIngs : [],
        categories: query.exIngTags ? query.exIngTags : []
      }
    });

    this.operation$.next({
      type: RecipeServiceOperationType.SetIngredients,
      payload: {
        target: TargetIngredients.Extra,
        ingredients: query.addIngs ? query.addIngs : [],
        categories: query.addIngTags ? query.addIngTags : []
      }
    });
  }

  setDisabledSearchModes() {
    this.disabledSearchModes.set();
  }

  setOrderingAndFilters() {
    const query = this.snapshot.search.query;
    this.operation$.next({
      type: RecipeServiceOperationType.SetOrderingAndFilters,
      payload: {
        filterByName: query.nameLike,
        orderBy: query.orderBy,
        orderBySort: query.orderBySort,
        minIngs: query.minIngs,
        maxIngs: query.maxIngs,
        times: query.times,
        sourcePages: query.sourcePages,
        useFavoritesOnly: this.userService.isLoggedIn ? query.useFavoritesOnly : undefined
      }
    })
  }

  handleExtraRelationAdjustments() {
    const handleExtraRelationOps =
      new WhenIngredientsChangedHandleExtraRelationsOps(this.snapshot, this.operation$);
    handleExtraRelationOps.handleExtraRelationAdjustments();
  }

  setSearchMode(){
    const appSearchMode = determineAppSearchMode(this.snapshot.search.query);
    this.operation$.next({
      type: RecipeServiceOperationType.SetSearchMode,
      payload: {searchMode: appSearchMode, ratio: this.snapshot.search.query.goodIngsRatio}
    });
  }

  setPageNumber() {
    this.operation$.next({
      type: RecipeServiceOperationType.SetPageNumber,
      payload: this.snapshot.currentPageNumber
    })
  }
}
