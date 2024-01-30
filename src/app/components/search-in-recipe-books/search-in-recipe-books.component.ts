import { Component } from '@angular/core';
import {RecipeBook} from "../../data/recipe-book";
import {debounceTime, distinctUntilChanged, Observable, of, OperatorFunction, switchMap} from "rxjs";

@Component({
  selector: 'app-search-in-recipe-books',
  templateUrl: './search-in-recipe-books.component.html',
  styleUrls: ['./search-in-recipe-books.component.scss']
})
export class SearchInRecipeBooksComponent {
  isInputFocused = false;
  added: RecipeBook[] = [];
  inputFormatter = () => '';

  removeRecipeBook(recipeBook: RecipeBook) {
    this.added = this.added.filter(a => a.id != recipeBook.id);
    // TODO Trigger change
  }

  addRecipeBook(recipeBook: RecipeBook) {
    this.added.push(recipeBook);
    // TODO Trigger change
  }

  search: OperatorFunction<string, readonly RecipeBook[]> = (text$: Observable<string>) => {
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

  private performSearch(term: string): Observable<RecipeBook[]> {
    if (!term || term.length < 2) {
      return of([]);
    }

    // TODO
    return of([]);
  }
}
