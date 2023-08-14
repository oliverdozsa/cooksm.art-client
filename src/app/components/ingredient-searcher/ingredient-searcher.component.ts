import {Component, Input, ViewChild} from '@angular/core';
import {TargetIngredients} from "../../data/target-ingredients";
import {DisplayedIngredient} from "../../data/displayed-ingredient";
import {IngredientSearchService} from "../../services/ingredient-search.service";
import {SearchIngredients} from "./search-ingredients";
import {
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged, finalize, map, merge,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap
} from "rxjs";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";

class IsSearchingOrDisplayedIngredient {
  constructor(public readonly wrapped: DisplayedIngredient | undefined = undefined, public readonly isSearching = true) {
    if(this.wrapped != undefined) {
      this.isSearching = false;
    }
  }
}

@Component({
  selector: 'app-ingredient-searcher',
  templateUrl: './ingredient-searcher.component.html',
  styleUrls: ['./ingredient-searcher.component.scss']
})
export class IngredientSearcherComponent {
  @Input() target: TargetIngredients = TargetIngredients.Included;

  @ViewChild('typeahead', {static: true}) typeahead!: NgbTypeahead;

  isInputFocused = false;
  selected: DisplayedIngredient[] = [];
  searchIngredients: SearchIngredients;

  constructor(ingredientSearchService: IngredientSearchService) {
    this.searchIngredients = new SearchIngredients(ingredientSearchService);
  }

  search: OperatorFunction<string, readonly IsSearchingOrDisplayedIngredient[]> = (text$: Observable<string>) => {
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

  private performSearch(term: string): Observable<IsSearchingOrDisplayedIngredient[]> {
    if (!term || term.length < 2) {
      return of([]);
    }

    const loader = of([new IsSearchingOrDisplayedIngredient()]);

    const searcher = this.searchIngredients.searchForIngredients(term)
      .pipe(
        delay(700),
        map(d => this.wrapInIsSearchingOrDisplayedIngredients(d)),
        catchError(() =>of([]))
      );

    return merge(loader, searcher);
  }

  private wrapInIsSearchingOrDisplayedIngredients(values: DisplayedIngredient[]) {
    return values.map(v => new IsSearchingOrDisplayedIngredient(v))
  }
}
