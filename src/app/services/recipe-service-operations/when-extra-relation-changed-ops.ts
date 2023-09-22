import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {RecipeServiceOperation} from "../recipe-service-operation";
import {RecipeServiceCommonOps} from "./recipe-service-common-ops";

export class WhenExtraRelationChangedOps {
  constructor(private snapshotForCurrentQuery: SearchSnapshot, private operation$: Subject<RecipeServiceOperation>) {
  }

  resetPaging() {
    const commonOps = new RecipeServiceCommonOps(this.snapshotForCurrentQuery, this.operation$);
    commonOps.resetPaging();
  }
}
