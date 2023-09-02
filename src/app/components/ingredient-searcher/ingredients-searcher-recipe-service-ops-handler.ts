import {RecipeServiceOperation, RecipeServiceOperationType} from "../../services/recipe-service-operation";
import {IngredientSearcherComponent} from "./ingredient-searcher.component";
import {DisplayedIngredient} from "../../data/displayed-ingredient";
import {IngredientCategory, IngredientName} from "src/app/data/ingredients";

export class IngredientsSearcherRecipeServiceOpsHandler {
  constructor(private component: IngredientSearcherComponent) {
  }

  process(operation: RecipeServiceOperation) {
    if (operation.type === RecipeServiceOperationType.SetIngredients &&
      operation.payload.target === this.component.target) {
      this.setIngredients(operation.payload)
    }
  }

  private setIngredients(ingredientsData: any) {
    const ingredientsPayload = ingredientsData.ingredients;
    const ingredients = ingredientsPayload.map((i: IngredientName) => DisplayedIngredient.fromIngredientName(i));

    const categoriesPayload = ingredientsData.categories;
    const categories = categoriesPayload.map((i: IngredientCategory) => DisplayedIngredient.fromIngredientCategory(i));

    this.component.added = ingredients ? ingredients : [];
    this.component.added = this.component.added.concat(categories ? categories : []);
  }
}
