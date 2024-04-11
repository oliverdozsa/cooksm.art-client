import {Component, OnDestroy, ViewChild} from '@angular/core';
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
  @ViewChild("recipeCardContainer") recipeCardContainer: any;

  currentPage: Page<Recipe> | undefined;
  isError: boolean = false;

  private _page: number = 1;
  private destroy$ = new Subject<void>();
  private shouldScrollToTop: boolean = false;

  get page(): number {
    return this._page;
  }

  set page(value: number) {
    this._page = value;
    this.recipesService.recipePageChanged(this._page);
  }

  get isEmpty(): boolean {
    return this.currentPage != undefined && this.currentPage.items.length === 0;
  }

  set pageThroughControl(value: number) {
    this.page = value;
    this.shouldScrollToTop = true;
  }

  get pageThroughControl(): number {
    return this.page;
  }

  constructor(private recipesService: RecipesService) {
    recipesService.results$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: p => this.onNextPage(p),
        error: e => this.onError(e)
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

  private onNextPage(page: Page<Recipe>) {
    this.currentPage = page;
    this.isError = false;

    if(!this.isEmpty && this.shouldScrollToTop) {
      this.shouldScrollToTop = false;
      setTimeout(() => this.recipeCardContainer.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"}));
    }
  }

  private onRecipesServiceOperation(operation: RecipeServiceOperation) {
    if (operation.type === RecipeServiceOperationType.SetPageNumber) {
      this._page = operation.payload;
    }
  }

  private onError(error: any) {
    console.log(`error: ${error}`);
    this.isError = true;
  }
}
