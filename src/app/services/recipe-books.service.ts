import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {delay, Observable, of, Subject, tap} from "rxjs";
import {RecipeBook, RecipeBooksOfRecipe} from "../data/recipe-book";
import {environment} from "../../environments/environment";
import {ToastsService, ToastType} from "./toasts.service";

@Injectable({
  providedIn: 'root'
})
export class RecipeBooksService {
  recipeBooks: RecipeBook[] = [];
  isLoading: boolean = true;
  available$: Subject<void> = new Subject<void>();

  private readonly baseUrl = environment.apiUrl + "/recipebooks";

  constructor(private httpClient: HttpClient, userService: UserService, private toastService: ToastsService) {
    if (userService.isLoggedIn) {
      this.load();
    } else {
      this.isLoading = false;
      userService.apiUserAvailable$.subscribe({
        next: () => this.load()
      })
    }
  }

  create(name: string) {
    const request = {
      name: name
    };

    this.isLoading = true;
    return this.httpClient.post<any>(this.baseUrl, request).subscribe({
      next: () => this.load(),
      error: () => this.onRequestError()
    });
  }

  delete(id: number) {
    this.httpClient.delete(this.baseUrl + `/${id}`).subscribe({
      next: () => this.load(),
      error: () => this.onRequestError()
    });
  }

  updateName(recipeBook: RecipeBook) {
    const request = {
      name: recipeBook.name
    };
    this.httpClient.put(this.baseUrl + `/${recipeBook.id}`, request).subscribe({
      next: () => this.load(),
      error: () => this.onRequestError()
    });
  }

  recipeBooksOf(recipeId: number): Observable<RecipeBooksOfRecipe> {
    const url = environment.apiUrl + `/recipes/${recipeId}/recipebooks`;
    return this.httpClient.get<RecipeBooksOfRecipe>(url)
      .pipe(
        tap({
          error: () => {
            const message = $localize`:@@recipe-books-service-failed-to-get-recipe-books:could not get recipe books of recipes!`;
            this.toastService.danger(message);
          }
        })
      );
  }

  addToRecipeBook(recipeId: number, recipeBookId: number): Observable<any> {
    const request = {
      recipeIds: [recipeId]
    };

    const url = `${this.baseUrl}/${recipeBookId}/recipes`;
    return this.httpClient.post(url, request)
      .pipe(
        delay(700)
      );
  }

  removeFromRecipeBook(recipeId: number, recipeBookId: number): Observable<any> {
    const request = {
      recipeIds: [recipeId]
    };

    const url = `${this.baseUrl}/${recipeBookId}/recipes`;
    return this.httpClient.delete(url, {body: request})
      .pipe(
        delay(700)
      );
  }

  private load() {
    this.isLoading = true;
    this.httpClient.get<RecipeBook[]>(this.baseUrl)
      .pipe(
        delay(700)
      )
      .subscribe({
        next: r => this.onAllRecipeBooksLoaded(r)
      })
  }

  private onAllRecipeBooksLoaded(recipeBooks: RecipeBook[]) {
    this.isLoading = false;
    this.recipeBooks = recipeBooks;
    this.available$.next();
  }

  private onRequestError() {
    this.isLoading = false;
    const errorMessage = $localize`:@@recipe-books-service-request-error:couldn't do it!`;
    this.toastService.danger(errorMessage);
  }
}
