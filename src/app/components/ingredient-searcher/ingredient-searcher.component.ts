import {Component, Input, ViewChild} from '@angular/core';
import {TargetIngredients} from "../../data/target-ingredients";
import {DisplayedIngredient} from "../../data/displayed-ingredient";
import {IngredientSearchService} from "../../services/ingredient-search.service";
import {SearchIngredients} from "./search-ingredients";
import {
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged, finalize, merge,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap
} from "rxjs";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";

enum IsSearching {}

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

  search: OperatorFunction<string, readonly DisplayedIngredient[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return of([]);
        }

        const loader = of([new DisplayedIngredient()])

        const searcher = this.searchIngredients.searchForIngredients(term)
          .pipe(
            delay(700),
            catchError(() =>of([]))
          );

        return merge(loader, searcher);
      })
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

  private performSearch(): Observable<DisplayedIngredient|IsSearching> {
    // TODO
  }
}
