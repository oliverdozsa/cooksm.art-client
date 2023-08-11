import {Component, Input, ViewChild} from '@angular/core';
import {TargetIngredients} from "../../data/target-ingredients";
import {DisplayedIngredient} from "../../data/displayed-ingredient";
import {IngredientSearchService} from "../../services/ingredient-search.service";
import {SearchIngredients} from "./search-ingredients";
import {debounceTime, delay, distinctUntilChanged, Observable, of, OperatorFunction, switchMap, tap} from "rxjs";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-ingredient-searcher',
  templateUrl: './ingredient-searcher.component.html',
  styleUrls: ['./ingredient-searcher.component.scss']
})
export class IngredientSearcherComponent {
  @Input() target: TargetIngredients = TargetIngredients.Included;

  @ViewChild('typeahead') typeahead!: NgbTypeahead;

  isInputFocused = false;
  selected: DisplayedIngredient[] = [];
  searchIngredients: SearchIngredients;
  isSearching = false;

  constructor(ingredientSearchService: IngredientSearchService) {
    this.searchIngredients = new SearchIngredients(ingredientSearchService);
  }

  search: OperatorFunction<string, readonly DisplayedIngredient[]> = (text$: Observable<string>) => {
    setTimeout(() => {
      this.typeahead.dismissPopup();
    });

    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => (this.isSearching = true)),
      delay(3000),
      switchMap((term) => {
        if(term.length < 2) {
          return of([]);
        }

        return this.searchIngredients.searchForIngredients(term)
      }),
      tap(() => (this.isSearching = false))
    )
  }

  get chipColor(): string {
    if(this.target == TargetIngredients.Excluded) {
      return "danger"
    }

    if(this.target == TargetIngredients.Extra) {
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
}
