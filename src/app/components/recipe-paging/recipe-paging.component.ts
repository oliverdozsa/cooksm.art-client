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

  constructor(private recipesService: RecipesService) {
    recipesService.results$.subscribe({
      next: p => this.currentPage = p
    });
  }
}
