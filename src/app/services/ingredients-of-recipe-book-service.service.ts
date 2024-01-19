import {Injectable} from '@angular/core';
import {loadMapFromLocalStorage, storeMapInLocalStorage} from "./localstorage";

@Injectable({
  providedIn: 'root'
})
export class IngredientsOfRecipeBookService {
  ingredientsIncludedStatesByRecipeBook = new Map<number, Map<number, boolean>>();

  constructor() {
    this.ingredientsIncludedStatesByRecipeBook = loadMapFromLocalStorage("ingredientStatesByRecipebook");
  }

  isIncluded(recipeBookId: number, ingredientId: number): boolean {
    if (this.ingredientsIncludedStatesByRecipeBook.has(recipeBookId) &&
      this.ingredientsIncludedStatesByRecipeBook.get(recipeBookId)!.has(ingredientId)) {
      return this.ingredientsIncludedStatesByRecipeBook.get(recipeBookId)!.get(ingredientId)!;
    }

    return false;
  }

  ignoreIngredientIn(recipeBookId: number, ingredientId: number) {
    if (!this.ingredientsIncludedStatesByRecipeBook.has(recipeBookId)) {
      this.ingredientsIncludedStatesByRecipeBook.set(recipeBookId, new Map<number, boolean>());
    }

    // Only keep what's included; since the default is false. It takes up less storage this way.
    this.ingredientsIncludedStatesByRecipeBook.get(recipeBookId)!.delete(ingredientId);
    this.save();
  }

  includeIngredientIn(recipeBookId: number, ingredientId: number) {
    if (!this.ingredientsIncludedStatesByRecipeBook.has(recipeBookId)) {
      this.ingredientsIncludedStatesByRecipeBook.set(recipeBookId, new Map<number, boolean>())
    }

    this.ingredientsIncludedStatesByRecipeBook.get(recipeBookId)!.set(ingredientId, true);
    this.save();
  }

  private save() {
    storeMapInLocalStorage("ingredientStatesByRecipebook", this.ingredientsIncludedStatesByRecipeBook);
  }
}
