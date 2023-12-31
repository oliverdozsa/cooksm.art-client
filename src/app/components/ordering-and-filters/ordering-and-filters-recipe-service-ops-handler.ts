import {OrderingAndFiltersComponent} from "./ordering-and-filters.component";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../../services/recipe-service-operation";
import {SourcePageSelections} from "./source-page-selections";

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
      this.component.params.useFavoritesOnly = operation.payload.useFavoritesOnly;

      if(this.component.sourcePagesService.allSourcePages.length > 0) {
        this.component.sourcePageSelections = new SourcePageSelections(this.component);
      }

      this.component.paramsEvent(false);
    }
  }
}
