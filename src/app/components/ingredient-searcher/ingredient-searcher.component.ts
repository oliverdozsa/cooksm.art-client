import {Component, Input} from '@angular/core';
import {TargetIngredients} from "../../data/target-ingredients";
import {DisplayedIngredient} from "../../data/displayed-ingredient";
import {IngredientSearchService} from "../../services/ingredient-search.service";
import {SearchIngredients} from "./search-ingredients";
import {
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged, map,
  Observable,
  of,
  OperatorFunction,
  switchMap, tap
} from "rxjs";

@Component({
  selector: 'app-ingredient-searcher',
  templateUrl: './ingredient-searcher.component.html',
  styleUrls: ['./ingredient-searcher.component.scss']
})
export class IngredientSearcherComponent {
  @Input() target: TargetIngredients = TargetIngredients.Included;

  isInputFocused = false;
  added: DisplayedIngredient[] = [];
  searchIngredients: SearchIngredients;
  isSearching = false;
  inputFormatter = () => '';

  constructor(ingredientSearchService: IngredientSearchService) {
    this.searchIngredients = new SearchIngredients(ingredientSearchService);
  }

  search: OperatorFunction<string, readonly DisplayedIngredient[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.performSearch(term))
    );
  }

  get chipColor(): string {
    if (this.target == TargetIngredients.Excluded) {
      return "danger"
    }

    if (this.target == TargetIngredients.Extra) {
      return "info"
    }

    return "success";
  }

  inputElementFocused() {
    this.isInputFocused = true;
  }

  inputElementLostFocus() {
    this.isInputFocused = false;
  }

  private performSearch(term: string): Observable<DisplayedIngredient[]> {
    if (!term || term.length < 2) {
      return of([]);
    }

    this.isSearching = true;
    return this.searchIngredients.searchForIngredients(term)
      .pipe(
        delay(700),
        map(r => this.filterNotAlreadyAdded(r)),
        catchError(() => of([])),
        tap(() => this.isSearching = false)
      );
  }

  private filterNotAlreadyAdded(ingredients: DisplayedIngredient[]) {
    return ingredients.filter(i => this.isNotAlreadyAdded(i))
  }

  private isNotAlreadyAdded(ingredient: DisplayedIngredient) {
    return this.added.find(e => e.equals(ingredient)) == undefined;
  }
}
