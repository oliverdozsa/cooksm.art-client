import {OrderingAndFiltersComponent} from "./ordering-and-filters.component";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../../services/recipe-service-operation";

export class OrderingAndFiltersRecipeServiceOpsHandler {
  constructor(private component: OrderingAndFiltersComponent) {
  }

  process(operation: RecipeServiceOperation) {
    if(operation.type === RecipeServiceOperationType.SetOrderingAndFilters) {
      this.component.params.filterByName = operation.payload.filterByName;
      // TODO

      this.component.paramsEvent();
    }
  }
}
