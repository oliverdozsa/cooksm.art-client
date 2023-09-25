import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";
import {RecipeServiceCommonOps} from "./recipe-service-common-ops";

export class WhenOrderingAndFiltersChanged {
  constructor(private snapshotForCurrentQuery: SearchSnapshot, private operation$: Subject<RecipeServiceOperation>) {
  }

  doWhatNecessary() {
    this.resetPaging();
  }

  resetPaging() {
    const commonOps = new RecipeServiceCommonOps(this.snapshotForCurrentQuery, this.operation$);
    commonOps.resetPaging();
  }
}
