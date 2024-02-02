import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {RecipeBook, RecipeBooksOfRecipe} from "../../data/recipe-book";
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  OperatorFunction,
  Subject,
  switchMap,
  takeUntil
} from "rxjs";
import {RecipeBooksService} from "../../services/recipe-books.service";
import {Recipe} from "../../data/recipe";
import {RecipesService} from "../../services/recipes.service";
import {SearchInRecipeBooksRecipeServiceOpHandler} from "./search-in-recipe-books-recipe-service-op-handler";

@Component({
  selector: 'app-search-in-recipe-books',
  templateUrl: './search-in-recipe-books.component.html',
  styleUrls: ['./search-in-recipe-books.component.scss']
})
export class SearchInRecipeBooksComponent implements OnDestroy {
  isInputFocused = false;
  added: RecipeBook[] = [];
  inputFormatter = () => '';

  private destroy$ = new Subject<void>();

  constructor(private recipeBookService: RecipeBooksService, private recipesService: RecipesService) {
    const recipesServiceOperationHandler = new SearchInRecipeBooksRecipeServiceOpHandler(this)

    this.recipesService.operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: o => recipesServiceOperationHandler.process(o)
      });
  }

  removeRecipeBook(recipeBook: RecipeBook) {
    this.added = this.added.filter(a => a.id != recipeBook.id);
    this.recipesService.recipeBooksChanged(this.added);
  }

  addRecipeBook(recipeBook: RecipeBook) {
    this.added.push(recipeBook);
    this.recipesService.recipeBooksChanged(this.added);
  }

  search: OperatorFunction<string, readonly RecipeBook[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.performSearch(term))
    );
  }

  inputElementFocused(event: Event) {
    this.isInputFocused = true;
    setTimeout(() => {
      const inputEvent: Event = new Event('input');
      event.target!.dispatchEvent(inputEvent);
    }, 0);
  }

  inputElementLostFocus() {
    this.isInputFocused = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private performSearch(term: string): Observable<RecipeBook[]> {
    const allNotAddedRecipeBooks = this.filterByNotAlreadyAdded();

    if (!term) {
      return of(allNotAddedRecipeBooks.slice(0, 20))
    }

    const matchingNotAddedRecipeBooks = allNotAddedRecipeBooks.filter(r => r.name.includes(term));
    return of(matchingNotAddedRecipeBooks);
  }

  private filterByNotAlreadyAdded(): RecipeBook[] {
    return this.recipeBookService.recipeBooks.filter(r => this.isNotAdded(r));
  }

  private isNotAdded(recipeBook: RecipeBook): boolean {
    return this.added.find((r => r.id == recipeBook.id)) == undefined;
  }
}
