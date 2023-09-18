import {Component, Input} from '@angular/core';
import {CookingTime, Recipe} from "../../data/recipe";
import {RecipesService} from "../../services/recipes.service";
import {IngredientCategory, IngredientName} from "../../data/ingredients";
import {TargetIngredients} from "../../data/target-ingredients";

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent {
  CookingTime = CookingTime;

  @Input() recipe: Recipe | undefined;

  isFlipped: boolean = false;

  constructor(private recipesService: RecipesService) {
  }

  getIngredientTextColorClass(ingredient: IngredientName) {
    if(this.isIngredientIn(ingredient, TargetIngredients.Included)) {
      return "text-success fw-bold";
    }

    if(this.isIngredientIn(ingredient, TargetIngredients.Extra)) {
      return "text-info fw-bold";
    }

    return "";
  }

  private isIngredientIn(ingredient: IngredientName, target: TargetIngredients): boolean {
    let ingredientsIdsToCheck = this.getIngredientIdsOf(target);
    return ingredientsIdsToCheck.find(id => id === ingredient.id) != undefined;
  }

  private getIngredientIdsOf(target: TargetIngredients): number[] {
    let sourceIngredients: IngredientName[] | undefined;
    let sourceIngredientTags: IngredientCategory[] | undefined;
    const query = this.recipesService.currentSearchSnapshot.search.query;

    if (target === TargetIngredients.Included) {
      sourceIngredients = query.inIngs;
      sourceIngredientTags = query.inIngTags;
    }

    if (target === TargetIngredients.Extra) {
      sourceIngredients = query.addIngs;
      sourceIngredientTags = query.addIngTags;
    }

    let flattenedIngredientsIds: number[] = [];
    if (sourceIngredients) {
      flattenedIngredientsIds = sourceIngredients.map(i => i.id);
    }

    if (sourceIngredientTags) {
      sourceIngredientTags.forEach(t => {
        flattenedIngredientsIds = flattenedIngredientsIds.concat(t.ingredients);
      })
    }

    return flattenedIngredientsIds;
  }
}
