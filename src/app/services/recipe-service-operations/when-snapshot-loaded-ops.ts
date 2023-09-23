import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";
import {TargetIngredients} from "../../data/target-ingredients";
import {DisabledSearchModes} from "./disabled-search-modes";
import {WhenIngredientsChangedHandleExtraRelationsOps} from "./when-ingredients-changed-handle-extra-relations-ops";
import {determineAppSearchMode} from "../../data/saved-recipe-search";
import {AppSearchMode} from "../../data/app-search-mode";

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
        ingredients: query.inIngs ? query.inIngs : [],
        categories: query.inIngTags ? query.inIngTags : []
      }
    });

    this.operation$.next({
      type: RecipeServiceOperationType.SetIngredients,
      payload: {
        target: TargetIngredients.Excluded,
        ingredients: query.exIngs ? query.exIngTags : [],
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
        times: query.times
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
      payload: {searchMode: appSearchMode}
    });
  }
}
