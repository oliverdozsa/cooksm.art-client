import {forkJoin, map, Observable, of} from "rxjs";
import {DisplayedIngredient} from "../../data/displayed-ingredient";
import {IngredientSearchService} from "../../services/ingredient-search.service";

export enum IngredientsSearchMode {
  Categories,
  NamesAndCategories
}

export class SearchIngredients {
  searchMode = IngredientsSearchMode.NamesAndCategories;

  constructor(private ingredientSearchService: IngredientSearchService) {
  }

  searchForIngredients(term: string): Observable<DisplayedIngredient[]> {
    if (!term || term.length < 2) {
      return of([]);
    }

    // We have to collect ingredients, or tags, or both. They are separate http requests --> separate observables.
    let ingredientsObservable: Observable<DisplayedIngredient[]> = of([]);
    if (this.searchMode === IngredientsSearchMode.NamesAndCategories) {
      ingredientsObservable = this.searchForIngredientNames(term);
    }

    let ingredientTagsObservable: Observable<DisplayedIngredient[]> = of([]);
    if (this.searchMode === IngredientsSearchMode.Categories || this.searchMode === IngredientsSearchMode.NamesAndCategories) {
      ingredientTagsObservable = this.searchForIngredientCategories(term);
    }

    // Join the observables, and merge them into one array.
    return forkJoin([ingredientsObservable, ingredientTagsObservable])
      .pipe(map(results => results[0].concat(results[1])));
  }

  private searchForIngredientNames(term: string): Observable<DisplayedIngredient[]> {
    return this.ingredientSearchService.getIngredientNames(term)
      .pipe(
        map(searchResult => searchResult.items.map((i => DisplayedIngredient.fromIngredientName(i))))
      );
  }

  private searchForIngredientCategories(term: string): Observable<DisplayedIngredient[]> {
    return this.ingredientSearchService.getIngredientCategories(term)
      .pipe(
        map(searchResult => searchResult.items.map((i => DisplayedIngredient.fromIngredientCategory(i))))
      );
  }
}
