import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {RecipeServiceOperation} from "../recipe-service-operation";

export class WhenSearchModeChangedOps {
  constructor(snapshotForCurrentQuery: SearchSnapshot, operation$: Subject<RecipeServiceOperation>) {
  }


}
