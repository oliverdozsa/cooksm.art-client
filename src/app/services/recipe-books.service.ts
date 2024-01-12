import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {delay, Subject} from "rxjs";
import {RecipeBook} from "../data/recipe-book";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RecipeBooksService {
  recipeBooks: RecipeBook[] = [];
  isLoading: boolean = true;
  available$: Subject<void> = new Subject<void>();

  private readonly baseUrl = environment.apiUrl + "/recipebooks";

  constructor(private httpClient: HttpClient, userService: UserService) {
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
      next: () => this.load()
    });
  }

  private load() {
    this.isLoading = true;
    this.httpClient.get<RecipeBook[]>(this.baseUrl)
      .pipe(
        delay(700)
      )
      .subscribe({
        next: r => this.onAllRecipesLoaded(r)
      })
  }

  private onAllRecipesLoaded(recipeBooks: RecipeBook[]) {
    this.isLoading = false;
    this.recipeBooks = recipeBooks;
    this.available$.next();
  }
}
