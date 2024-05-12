import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RecipeBooksService} from "../../../services/recipe-books.service";
import {RecipeSearchService} from "../../../services/recipe-search.service";

@Component({
  selector: 'app-menu-course-editor',
  templateUrl: './menu-course-editor.component.html',
  styleUrl: './menu-course-editor.component.scss'
})
export class MenuCourseEditorComponent {
  @Input()
  order: number = 0;

  @Output()
  selectedRecipe: EventEmitter<any> = new EventEmitter<any>();

  selectedRecipeName: string | undefined;
  selectedRecipeId: number | undefined;
  recipeSource: RecipeSource = RecipeSource.RandomRecipeBook;

  constructor(public recipeBooksService: RecipeBooksService, private recipesSearchService: RecipeSearchService) {

  }

  onRecipeSelected(recipeId: number) {
    this.selectedRecipe.emit({recipeId: recipeId, order: this.order});
  }

  protected readonly RecipeSource = RecipeSource;
}

export enum RecipeSource {
  RandomRecipeBook,
  SelectFromRecipeBook,
  SearchForARecipe
}
