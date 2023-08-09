import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiPaths} from "../api-paths";
import {environment} from "../../environments/environment";
import {IngredientCategory, IngredientName} from "../data/ingredients";
import {Page} from "../data/page";

@Injectable({
  providedIn: 'root'
})
export class IngredientSearchService {
  private readonly languageId = $localize`1`; // TODO change this to English ID
  private readonly ingredientNamesUrl = environment.apiUrl + '/' + ApiPaths.INGREDIENT_NAMES;
  private readonly ingredientCategoriesUrl = environment.apiUrl + '/' + ApiPaths.INGREDIENT_CATEGORIES;

  constructor(private httpclient: HttpClient) {
  }

  getIngredientNames(nameLike: string, offset = 0, limit = 10) {
    const params = new HttpParams()
      .set('languageId', this.languageId.toString())
      .set('nameLike', nameLike)
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    return this.httpclient.get<Page<IngredientName>>(this.ingredientNamesUrl, {params});
  }

  getIngredientCategories(nameLike: string, offset = 0, limit = 10) {
    const params = new HttpParams()
      .set('languageId', this.languageId.toString())
      .set('nameLike', nameLike)
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    return this.httpclient.get<Page<IngredientCategory>>(this.ingredientCategoriesUrl, {params});
  }
}
