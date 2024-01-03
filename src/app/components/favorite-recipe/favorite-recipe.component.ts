import {Component, Input, OnDestroy} from '@angular/core';
import {FavoriteRecipesService} from "../../services/favorite-recipes.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-favorite-recipe',
  templateUrl: './favorite-recipe.component.html',
  styleUrls: ['./favorite-recipe.component.scss']
})
export class FavoriteRecipeComponent {
  @Input() recipeId: number = -1;

  isWorking: boolean = false;

  get isLoading(): boolean {
    return !this.favoriteRecipesService.areFavoriteRecipesAvailable || this.isWorking;
  }

  get isFavorite(): boolean {
    return !this.isLoading && this.favoriteRecipesService.favoriteRecipes.has(this.recipeId);
  }

  constructor(private favoriteRecipesService: FavoriteRecipesService) {
  }

  like() {
    this.isWorking = true;
    this.favoriteRecipesService.like(this.recipeId)
      .subscribe({
        next: () => this.isWorking = false,
        error: () => this.isWorking = false
      });
  }

  dislike() {
    this.isWorking = true;
    this.favoriteRecipesService.dislike(this.recipeId)
      .subscribe({
        next: () => this.isWorking = false,
        error: () => this.isWorking = false
      });
  }
}
