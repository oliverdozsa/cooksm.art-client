import {IngredientName, IngredientCategory} from "./ingredients";

export class DisplayedIngredient {
  displayedName = '<NOT SET>';
  ingredientName: IngredientName | undefined = undefined;
  ingredientCategory: IngredientCategory | undefined = undefined;

  get isCategory(): boolean {
    return this.ingredientCategory !== undefined;
  }

  get isEmpty() {
    return this.ingredientName == undefined && this.ingredientCategory == undefined;
  }

  equals(other: DisplayedIngredient): boolean {
    if(!other) {
      return false;
    }

    if(other.isCategory && this.isCategory) {
      return this.ingredientCategory?.id === other.ingredientCategory?.id
    }

    if(!other.isCategory && !this.isCategory) {
      return this.ingredientName?.id === other.ingredientName?.id;
    }

    return false;
  }

  static fromIngredientName(ingredientName: IngredientName): DisplayedIngredient {
    const displayedIngredient = new DisplayedIngredient();
    displayedIngredient.ingredientName = ingredientName;
    displayedIngredient.displayedName = ingredientName.name;

    if (ingredientName.altNames && ingredientName.altNames.length > 0) {
      displayedIngredient.displayedName += ` (${ingredientName.altNames.join(', ')})`;
    }

    return displayedIngredient;
  }

  static fromIngredientCategory(ingredientCategory: IngredientCategory): DisplayedIngredient {
    const displayedIngredient = new DisplayedIngredient();
    displayedIngredient.ingredientCategory = ingredientCategory;

    displayedIngredient.displayedName = ingredientCategory.name + ' 🏷️';

    return displayedIngredient;
  }
}
