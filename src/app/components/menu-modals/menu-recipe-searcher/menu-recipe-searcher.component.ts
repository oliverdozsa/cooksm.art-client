import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  Observable,
  of,
  OperatorFunction,
  switchMap, tap
} from "rxjs";
import {Recipe} from "../../../data/recipe";
import {RecipeSearchService} from "../../../services/recipe-search.service";
import {RecipeQueryParams} from "../../../services/recipe-query-params";
import {LanguageService} from "../../../services/language.service";

@Component({
  selector: 'app-menu-recipe-searcher',
  templateUrl: './menu-recipe-searcher.component.html',
  styleUrl: './menu-recipe-searcher.component.scss'
})
export class MenuRecipeSearcherComponent {
  @Input()
  recipeBookId: number | undefined;

  @Output()
  selectedRecipe: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  isSearching = false;
  inputFormatter = () => '';

  constructor(private recipeSearchService: RecipeSearchService, private languageService: LanguageService) {
  }

  search: OperatorFunction<string, readonly Recipe[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.performSearch(term))
    );
  }

  onRecipeSelected(item: Recipe) {
    this.selectedRecipe.emit(item);
  }

  private performSearch(term: string): Observable<Recipe[]> {
    if (!term || term.length < 2) {
      return of([]);
    }

    this.isSearching = true;
    const queryParams = new RecipeQueryParams();
    queryParams.nameLike = term;
    queryParams.offset = 0;
    queryParams.limit = 10;
    queryParams.languageId = this.languageService.usedLanguageId;

    if (this.recipeBookId != undefined) {
      queryParams.recipeBooks = [this.recipeBookId];
    }

    return this.recipeSearchService.query(queryParams)
      .pipe(
        delay(700),
        map(p => p.items),
        tap(() => this.isSearching = false)
      );
  }
}
