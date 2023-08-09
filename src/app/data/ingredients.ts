import {DisplayedIngredient} from "./displayed-ingredient";
import {TargetIngredients} from "./target-ingredients";
import {DisabledIngredients} from "./ingredients-disabled-states";

export class IngredientName {
  id: number = -1;
  name: string = '<NOT SET>';
  altNames: string[] = [];
}

export class IngredientCategory {
  id: number = -1;
  name: string = '<NOT SET>';
  ingredients: number[] = [];
}

export class Ingredients {
  included: DisplayedIngredient[] = [];
  excluded: DisplayedIngredient[] = [];
  extra: DisplayedIngredient[] = [];

  countOfIncludedNames(): number {
    return Ingredients.countOfNames(this.included);
  }

  countOfIncludedCategories(): number {
    return Ingredients.countOfCategories(this.included);
  }

  filterByDisabledState(target: TargetIngredients, disabledState: DisabledIngredients) {
    const ingredients = this.selectIngredientsBy(target);

    if (disabledState === DisabledIngredients.None) {
      return ingredients;
    }

    if (disabledState === DisabledIngredients.Categories) {
      return ingredients.filter(i => !i.isCategory);
    }

    if (disabledState === DisabledIngredients.NamesAndCategories) {
      return [];
    }

    return [];
  }

  toFlattenedIngredientIdsFilteredByDisabledState(target: TargetIngredients, disabledState: DisabledIngredients): number[] {
    let sourceDisplayedIngredients = this.filterByDisabledState(target, disabledState);

    let ingredientIds = sourceDisplayedIngredients!
      .filter(i => !i.isCategory)
      .map(i => i.ingredientName!.id);

    sourceDisplayedIngredients!
      .filter(i => i.isCategory)
      .forEach(i => ingredientIds = ingredientIds.concat(i.ingredientCategory!.ingredients))

    return ingredientIds;
  }

  copy(): Ingredients {
    const copy = new Ingredients();
    copy.included = [...this.included];
    copy.excluded = [...this.excluded];
    copy.extra = [...this.extra];

    return copy;
  }

  private selectIngredientsBy(target: TargetIngredients): DisplayedIngredient[] {
    if (target === TargetIngredients.Included) {
      return this.included;
    }

    if (target === TargetIngredients.Excluded) {
      return this.excluded;
    }

    if (target === TargetIngredients.Extra) {
      return this.extra;
    }

    return [];
  }

  private static countOfNames(displayedIngredients: DisplayedIngredient[]): number {
    return displayedIngredients.filter(i => !i.isCategory).length;
  }

  private static countOfCategories(displayedIngredients: DisplayedIngredient[]): number {
    return displayedIngredients.filter(i => i.isCategory).length;
  }
}
