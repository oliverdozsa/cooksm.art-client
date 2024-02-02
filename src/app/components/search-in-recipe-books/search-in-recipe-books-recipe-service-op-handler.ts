import {SearchInRecipeBooksComponent} from "./search-in-recipe-books.component";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../../services/recipe-service-operation";

export class SearchInRecipeBooksRecipeServiceOpHandler {
  constructor(private component: SearchInRecipeBooksComponent) {
  }

  process(operation: RecipeServiceOperation) {
    if (operation.type === RecipeServiceOperationType.SetRecipeBooks && operation.payload) {
      this.component.added = operation.payload;
    }
  }
}
