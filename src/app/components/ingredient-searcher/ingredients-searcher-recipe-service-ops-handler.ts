import {RecipeServiceOperation, RecipeServiceOperationType} from "../../services/recipe-service-operation";
import {IngredientSearcherComponent} from "./ingredient-searcher.component";
import {DisplayedIngredient} from "../../data/displayed-ingredient";
import {IngredientCategory, IngredientName} from "src/app/data/ingredients";
import {TargetIngredients} from "../../data/target-ingredients";
import {DisabledIngredients} from "../../data/ingredients-disabled-states";

export class IngredientsSearcherRecipeServiceOpsHandler {
  constructor(private component: IngredientSearcherComponent) {
  }

  process(operation: RecipeServiceOperation) {
    if (operation.type === RecipeServiceOperationType.SetIngredients &&
      operation.payload.target === this.component.target) {
      this.setIngredients(operation.payload)
    }

    if (operation.type === RecipeServiceOperationType.DisableIngredients) {
      this.disable(operation.payload.target, operation.payload.disable);
    }

    if (operation.type === RecipeServiceOperationType.SetDisplayedIngredients) {
      this.setDisplayedIngredients(operation.payload);
    }
  }

  private setIngredients(payload: any) {
    const ingredientsPayload = payload.ingredients;
    const ingredients = ingredientsPayload.map((i: IngredientName) => DisplayedIngredient.fromIngredientName(i));

    const categoriesPayload = payload.categories;
    const categories = categoriesPayload.map((i: IngredientCategory) => DisplayedIngredient.fromIngredientCategory(i));

    this.component.added = ingredients ? ingredients : [];
    this.component.added = this.component.added.concat(categories ? categories : []);
  }

  private disable(target: TargetIngredients, disable: DisabledIngredients) {
    if (this.component.target === target) {
      this.component.disable = disable;
    }
  }

  private setDisplayedIngredients(payload: any) {
    if (payload.target != this.component.target) {
      return;
    }

    this.component.added = payload.ingredients;
  }
}
