import {OrderingAndFiltersComponent} from "./ordering-and-filters.component";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../../services/recipe-service-operation";

export class OrderingAndFiltersRecipeServiceOpsHandler {
  constructor(private component: OrderingAndFiltersComponent) {
  }

  process(operation: RecipeServiceOperation) {
    if(operation.type === RecipeServiceOperationType.SetOrderingAndFilters) {
      this.component.params.filterByName = operation.payload.filterByName;
      this.component.params.orderBy = operation.payload.orderBy;
      this.component.params.orderBySort = operation.payload.orderBySort;
      this.component.params.minIngs = operation.payload.minIngs;
      this.component.params.maxIngs = operation.payload.maxIngs;
      this.component.params.times = operation.payload.times;
      this.component.params.sourcePages = operation.payload.sourcePages;

      this.component.paramsEvent();
    }
  }
}
