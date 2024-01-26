import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {delay, Observable, Subject, tap} from "rxjs";
import {environment} from "../../environments/environment";
import {ApiPaths} from "../api-paths";
import {UserService} from "./user.service";
import {ToastsService, ToastType} from "./toasts.service";

@Injectable({
  providedIn: 'root'
})
export class FavoriteRecipesService {
  favoriteRecipes: Map<number, number> = new Map<number, number>();
  areFavoriteRecipesAvailable: boolean = false;

  private readonly url = `${environment.apiUrl}/${ApiPaths.FAVORITE_RECIPES}`

  constructor(userService: UserService, private httpClient: HttpClient, private toastService: ToastsService) {
    userService.apiUserAvailable$.subscribe({
      next: () => this.getFavoriteRecipesOfUser()
    });
  }

  like(recipeId: number): Observable<any> {
    const request = {
      recipeId: recipeId
    }

    return this.httpClient.post<any>(this.url, request, {observe: "response"})
      .pipe(
        delay(700),
        tap({
          next: r => this.onLikeSuccess(recipeId, r),
          error: () => this.onLikeFail()
        })
      )
  }

  dislike(recipeId: number): Observable<any> {
    const favoriteId = this.favoriteRecipes.get(recipeId);
    const deleteUrl = `${this.url}/${favoriteId}`;

    return this.httpClient.delete(deleteUrl)
      .pipe(
        delay(700),
        tap({
          next: () => this.onDislikeSuccess(recipeId),
          error: () => this.onDislikeFail()
        })
      )
  }

  private getFavoriteRecipesOfUser() {
    this.httpClient.get<FavoriteRecipe[]>(this.url).pipe(delay(1000)).subscribe({
      next: f => this.onFavoriteRecipesGot(f)
    });
  }

  private onFavoriteRecipesGot(favorites: FavoriteRecipe[]) {
    this.favoriteRecipes = new Map<number, number>(favorites.map(f => [f.recipeId, f.id]));
    this.areFavoriteRecipesAvailable = true;
  }

  private onLikeSuccess(recipeId: number, response: HttpResponse<any>) {
    const locationUrl = response.headers.get("Location");
    const locationParts = locationUrl?.split("/");
    const favoriteId = parseInt(locationParts![locationParts!.length - 1]);

    this.favoriteRecipes.set(recipeId, favoriteId);
  }

  private onLikeFail() {
    const toastText = $localize`:@@favorite-service-like-failed:Could not do it! 😥`
    this.toastService.danger(toastText);
  }

  private onDislikeSuccess(recipeId: number) {
    this.favoriteRecipes.delete(recipeId);
  }

  private onDislikeFail() {
    const toastText = $localize`:@@favorite-service-dislike-failed:Could not do it! 😥`
    this.toastService.danger(toastText);
  }
}

interface FavoriteRecipe {
  id: number,
  recipeId: number
}
