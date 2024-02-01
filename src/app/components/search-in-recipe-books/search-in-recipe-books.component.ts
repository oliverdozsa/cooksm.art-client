import {Component, ElementRef, ViewChild} from '@angular/core';
import {RecipeBook} from "../../data/recipe-book";
import {debounceTime, distinctUntilChanged, Observable, of, OperatorFunction, switchMap} from "rxjs";
import {RecipeBooksService} from "../../services/recipe-books.service";

@Component({
  selector: 'app-search-in-recipe-books',
  templateUrl: './search-in-recipe-books.component.html',
  styleUrls: ['./search-in-recipe-books.component.scss']
})
export class SearchInRecipeBooksComponent {
  isInputFocused = false;
  added: RecipeBook[] = [];
  inputFormatter = () => '';

  constructor(private recipeBookService: RecipeBooksService) {
  }

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
    if(!term) {
      return of(this.recipeBookService.recipeBooks.slice(0, 20))
    }

    const matchingRecipeBooks = this.recipeBookService.recipeBooks.filter(r => r.name.includes(term));
    return of(matchingRecipeBooks);
  }
}
