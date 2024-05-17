import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RecipeBooksService} from "../../../services/recipe-books.service";
import {RecipeSearchService} from "../../../services/recipe-search.service";
import {Recipe} from "../../../data/recipe";
import {RecipeQueryParams} from "../../../services/recipe-query-params";
import {ToastsService} from "../../../services/toasts.service";
import {delay} from "rxjs";

@Component({
  selector: 'app-menu-course-editor',
  templateUrl: './menu-course-editor.component.html',
  styleUrl: './menu-course-editor.component.scss'
})
export class MenuCourseEditorComponent {
  @Input()
  order: number = 0;

  @Output()
  remove: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  recipeSelected: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  @Input()
  recipe: Recipe | undefined;

  selectedRecipeBookId: number | undefined;
  recipeSource: RecipeSource = RecipeSource.RandomRecipeBook;
  editStarted: boolean = false;

  isWorking: boolean = false;

  get selectedRecipeBookIdForSearch(): number | undefined {
    if (this.recipeSource == RecipeSource.SelectFromRecipeBook) {
      return this.selectedRecipeBookId;
    }

    return undefined;
  }

  get areRecipeBooksUsable(): boolean {
    return this.recipeBooksService.recipeBooks.length > 0;
  }

  get shouldShowRecipeSourceSelectors(): boolean {
    return this.recipe == undefined || this.editStarted;
  }

  protected readonly RecipeSource = RecipeSource;

  constructor(public recipeBooksService: RecipeBooksService, private recipeSearchService: RecipeSearchService,
              private toasts: ToastsService) {
    if (this.areRecipeBooksUsable) {
      this.selectedRecipeBookId = recipeBooksService.recipeBooks[0].id;
    } else {
      this.recipeSource = RecipeSource.SearchForARecipe;
    }
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeSelected.emit(recipe);
    this.recipe = recipe;
    this.editStarted = false;
  }

  onEditToggle() {
    this.editStarted = !this.editStarted;
  }

  onRandomClick() {
    this.isWorking = true;

    const queryParams = new RecipeQueryParams();
    queryParams.recipeBooks = [this.selectedRecipeBookId!];
    queryParams.limit = 1;
    queryParams.offset = 0;

    this.recipeSearchService.query(queryParams)
      .pipe(delay(300))
      .subscribe({
        next: p => this.onRecipeBookSize(p.totalCount),
        error: () => this.onErrorDuringRandomQuery()
      })
  }

  private onRecipeBookSize(recipeBookSize: number) {
    if (recipeBookSize < 1) {
      this.toasts.danger("Recipe book is empty.");
    } else {
      const queryParams = new RecipeQueryParams();
      queryParams.recipeBooks = [this.selectedRecipeBookId!];
      queryParams.limit = 1;
      queryParams.offset = Math.floor(Math.random() * recipeBookSize);

      this.recipeSearchService.query(queryParams)
        .pipe(delay(300))
        .subscribe({
          next: p => this.onRandomRecipeGot(p.items[0]),
          error: () => this.onErrorDuringRandomQuery()
        });
    }
  }

  private onRandomRecipeGot(recipe: Recipe) {
    this.onRecipeSelected(recipe);
    this.isWorking = false;
  }

  private onErrorDuringRandomQuery() {
    this.isWorking = false;
    this.toasts.danger("Couldn't do it :(! Try again maybe!")
  }
}

export enum RecipeSource {
  RandomRecipeBook,
  SelectFromRecipeBook,
  SearchForARecipe
}
