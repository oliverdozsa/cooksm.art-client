import {Component} from '@angular/core';
import {RecipesService} from "../../services/recipes.service";
import {Recipe} from "../../data/recipe";
import {Page} from "../../data/page";

@Component({
  selector: 'app-recipe-paging',
  templateUrl: './recipe-paging.component.html',
  styleUrls: ['./recipe-paging.component.scss']
})
export class RecipePagingComponent {
  currentPage: Page<Recipe> | undefined;

  private _page: number = 0;

  get page(): number {
    return this._page;
  }

  set page(value: number) {
    this._page = value;
    this.recipesService.recipePageChanged(this._page);
  }

  constructor(private recipesService: RecipesService) {
    recipesService.results$.subscribe({
      next: p => this.currentPage = p
    });
  }
}
