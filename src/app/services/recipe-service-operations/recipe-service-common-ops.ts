import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";

export class RecipeServiceCommonOps {
  constructor(private snapshotForCurrentQuery: SearchSnapshot, private operation$: Subject<RecipeServiceOperation>) {
  }

  resetPaging() {
    this.snapshotForCurrentQuery.currentPageNumber = 1;
    this.operation$.next({
      type: RecipeServiceOperationType.SetPageNumber,
      payload: 1
    })
  }
}
