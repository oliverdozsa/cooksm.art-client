import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
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
  OperatorFunction, Subject,
  switchMap, takeUntil, tap
} from "rxjs";
import {RecipesService} from "../../services/recipes.service";
import {IngredientsSearcherSearchParamsOperationHandler} from "./ingredients-searcher-search-params-operation-handler";

@Component({
  selector: 'app-ingredient-searcher',
  templateUrl: './ingredient-searcher.component.html',
  styleUrls: ['./ingredient-searcher.component.scss']
})
export class IngredientSearcherComponent implements OnDestroy {
  @Input() target = TargetIngredients.Included;

  isInputFocused = false;
  added: DisplayedIngredient[] = [];
  searchIngredients: SearchIngredients;
  isSearching = false;
  inputFormatter = () => '';
  destroy$ = new Subject<void>();

  get chipColor(): string {
    if (this.target == TargetIngredients.Excluded) {
      return "danger"
    } else if (this.target == TargetIngredients.Extra) {
      return "info"
    }

    return "success";
  }

  constructor(ingredientSearchService: IngredientSearchService, private searchParamsService: RecipesService) {
    this.searchIngredients = new SearchIngredients(ingredientSearchService);

    const searchParamsOperationHandler = new IngredientsSearcherSearchParamsOperationHandler(this);
    this.searchParamsService.operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: o => searchParamsOperationHandler.process(o)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  search: OperatorFunction<string, readonly DisplayedIngredient[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.performSearch(term))
    );
  }

  inputElementFocused() {
    this.isInputFocused = true;
  }

  inputElementLostFocus() {
    this.isInputFocused = false;
  }

  removeIngredients(ingredient: DisplayedIngredient) {
    this.added = this.added.filter(a => !a.equals(ingredient));
    this.searchParamsService.ingredientsChangedIn(this.target, this.added);
  }

  addIngredient(ingredient: DisplayedIngredient) {
    this.added.push(ingredient);
    this.searchParamsService.ingredientsChangedIn(this.target, this.added);
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
