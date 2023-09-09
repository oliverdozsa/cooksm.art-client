import {Component, OnDestroy} from '@angular/core';
import {RecipesService} from "../../services/recipes.service";
import {Recipe} from "../../data/recipe";
import {Page} from "../../data/page";
import {Subject, takeUntil} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../../services/recipe-service-operation";

@Component({
  selector: 'app-recipe-paging',
  templateUrl: './recipe-paging.component.html',
  styleUrls: ['./recipe-paging.component.scss']
})
export class RecipePagingComponent implements OnDestroy {
  currentPage: Page<Recipe> | undefined;

  private _page: number = 1;
  private destroy$ = new Subject<void>();

  get page(): number {
    return this._page;
  }

  set page(value: number) {
    this._page = value;
    this.recipesService.recipePageChanged(this._page);
  }

  constructor(private recipesService: RecipesService) {
    recipesService.results$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: p => this.currentPage = p
      });

    recipesService.operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: o => this.onRecipesServiceOperation(o)
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onRecipesServiceOperation(operation: RecipeServiceOperation) {
    if (operation.type === RecipeServiceOperationType.SetPageNumber) {
      this._page = operation.payload;
    }
  }
}
