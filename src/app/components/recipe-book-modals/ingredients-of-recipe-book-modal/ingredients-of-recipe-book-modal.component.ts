import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {RecipeBook} from "../../../data/recipe-book";
import {IngredientName} from "../../../data/ingredients";
import {RecipeSearchService} from "../../../services/recipe-search.service";
import {ToastsService, ToastType} from "../../../services/toasts.service";
import {IngredientsOfRecipeBookService} from "../../../services/ingredients-of-recipe-book-service.service";
import {ClipboardService} from "ngx-clipboard";
import {delay} from "rxjs";
import {RecipeQueryParams} from "../../../services/recipe-query-params";
import {Recipe} from "../../../data/recipe";
import {Page} from "../../../data/page";

@Component({
  selector: 'app-ingredients-of-recipe-book-modal',
  templateUrl: './ingredients-of-recipe-book-modal.component.html',
  styleUrls: ['./ingredients-of-recipe-book-modal.component.scss']
})
export class IngredientsOfRecipeBookModalComponent {
  @Input()
  recipeBook: RecipeBook | undefined;

  isWorkLeft = true;

  ingredients: IngredientName[] = [];

  private uniqueIngredients: Map<number, IngredientName> = new Map();

  get progress() {
    if (this.isPagingNotStartedYet()) {
      return 0;
    }

    return Math.floor((this.pagesProcessed / this.pagesTotal) * 100)
  }

  get isNoneIncluded() {
    for (let ingredient of this.ingredients) {
      if (this.isIncluded(ingredient.id)) {
        return false;
      }
    }

    return true;
  }

  private pagesProcessed = 0;
  private pagesTotal = -1;

  private queryParamLimit = 25;

  constructor(public activeModal: NgbActiveModal, private recipeSearchService: RecipeSearchService, private toastService: ToastsService,
              private ingredientsOfRecipeBookService: IngredientsOfRecipeBookService, private clipboardService: ClipboardService) {
  }

  start(): void {
    this.isWorkLeft = true;
    this.getRecipesOfBookIfNeeded();
  }

  onCopySelectedToClipboardClick() {
    const includedNames = this.ingredients
      .filter(i => this.isIncluded(i.id))
      .map(i => i.name);

    const clipboardText = includedNames.join("\n");
    this.clipboardService.copy(clipboardText);

    const message = $localize`:@@ingredients-of-recipe-books-modal-copied-to-clipboard:${includedNames.length} ingredient(s) has been copied to clipboard`;
    this.toastService.success(message);
  }

  isIncluded(ingredientId: number): boolean {
    return this.ingredientsOfRecipeBookService.isIncluded(this.recipeBook!.id, ingredientId);
  }

  onIncludedToggleClick(ingredientId: number) {
    const isIncludedCurrently = this.isIncluded(ingredientId);

    if (isIncludedCurrently) {
      this.ingredientsOfRecipeBookService.ignoreIngredientIn(this.recipeBook!.id, ingredientId);
    } else {
      this.ingredientsOfRecipeBookService.includeIngredientIn(this.recipeBook!.id, ingredientId);
    }

    this.moveIncludedToTheTop();
  }

  private getRecipesOfBookIfNeeded() {
    this.isWorkLeft = this.isPagingNotStartedYet() || this.pagesProcessed < this.pagesTotal;

    if (this.isWorkLeft) {
      const queryParams = new RecipeQueryParams();
      queryParams.offset = this.pagesProcessed * this.queryParamLimit;
      queryParams.limit = this.queryParamLimit;
      queryParams.recipeBooks = [this.recipeBook!.id];

      this.recipeSearchService.query(queryParams)
        .pipe(
          delay(300)
        )
        .subscribe({
          next: p => this.onRecipePage(p),
          error: () => {
            this.isWorkLeft = false;
            const message = $localize`:@@ingredients-of-recipe-books-modal-failed-to-query:couldn't do it! 😥 try again maybe...`;
            this.toastService.danger(message);
          }
        })
    } else {
      this.ingredients = Array.from(this.uniqueIngredients.values());
      this.moveIncludedToTheTop();
    }
  }

  private isPagingNotStartedYet() {
    return this.pagesTotal == -1;
  }

  private onRecipePage(page: Page<Recipe>) {
    this.pagesTotal = Math.ceil(page.totalCount / this.queryParamLimit)
    this.pagesProcessed++;

    page.items.forEach(r => this.addAllIngredientsOfRecipe(r));

    this.getRecipesOfBookIfNeeded();
  }

  private addAllIngredientsOfRecipe(recipe: Recipe) {
    recipe.ingredients.forEach(i => this.uniqueIngredients.set(i.id, i));
  }

  private moveIncludedToTheTop() {
    const includedIds = this.ingredients
      .filter(i => this.isIncluded(i.id))
      .map(i => i.id);

    const includeds = this.ingredients.filter(i => includedIds.includes(i.id));
    const ignoreds = this.ingredients.filter(i => !includedIds.includes(i.id));

    this.ingredients = includeds.concat(ignoreds);
  }
}
