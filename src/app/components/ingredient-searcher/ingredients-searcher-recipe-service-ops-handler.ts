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

    if (operation.type === RecipeServiceOperationType.RemoveIngredients) {
      this.remove(operation.payload.target, operation.payload.items, operation.payload.shouldTriggerSearch);
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

  private disable(target: TargetIngredients, disable: DisabledIngredients) {
    if (this.component.target === target) {
      this.component.disable = disable;
    }
  }

  private remove(target: TargetIngredients, itemsToRemove: DisplayedIngredient[], shouldTriggerSearch: boolean) {
    if(this.component.target != target) {
      return;
    }

    this.component.added = this.component.added.filter(i => this.isNotIn(i, itemsToRemove));

    if(shouldTriggerSearch) {
      this.component.recipesService.ingredientsChangedIn(this.component.target, this.component.added);
    }
  }

  private isNotIn(ingredient: DisplayedIngredient, items: DisplayedIngredient[]): boolean {
    return items.find(i => i.equals(ingredient)) === undefined;
  }
}
