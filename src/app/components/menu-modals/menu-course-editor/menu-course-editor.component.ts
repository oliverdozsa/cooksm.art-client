import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RecipeBooksService} from "../../../services/recipe-books.service";
import {RecipeSearchService} from "../../../services/recipe-search.service";
import {Recipe} from "../../../data/recipe";

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

  selectedRecipe: Recipe | undefined;
  selectedRecipeBookId: number | undefined;
  recipeSource: RecipeSource = RecipeSource.RandomRecipeBook;
  editStarted: boolean = false;

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
    return this.selectedRecipe == undefined || this.editStarted;
  }

  protected readonly RecipeSource = RecipeSource;

  constructor(public recipeBooksService: RecipeBooksService) {
    if (this.areRecipeBooksUsable) {
      this.selectedRecipeBookId = recipeBooksService.recipeBooks[0].id;
    } else {
      this.recipeSource = RecipeSource.SearchForARecipe;
    }
  }

  onRecipeSelected(recipe: Recipe) {
    this.selectedRecipe = recipe;
    this.editStarted = false;
  }

  onEditToggle() {
    this.editStarted = !this.editStarted;
  }
}

export enum RecipeSource {
  RandomRecipeBook,
  SelectFromRecipeBook,
  SearchForARecipe
}
