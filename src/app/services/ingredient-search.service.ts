import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiPaths} from "../api-paths";
import {environment} from "../../environments/environment";
import {IngredientCategory, IngredientName} from "../data/ingredients";
import {Page} from "../data/page";
import {SearchSnapshotTransform} from "../data/search-snapshot-ops/search-snapshot-transform";
import {SearchSnapshotService} from "./search-snapshot.service";

@Injectable({
  providedIn: 'root'
})
export class IngredientSearchService {
  private readonly ingredientNamesUrl = environment.apiUrl + '/' + ApiPaths.INGREDIENT_NAMES;
  private readonly ingredientCategoriesUrl = environment.apiUrl + '/' + ApiPaths.INGREDIENT_CATEGORIES;
  private readonly byIngredientIdsUrl: string = environment.apiUrl + '/' +  ApiPaths.INGREDIENT_NAMES + '/byids';
  private readonly byCategoryIdsUrl: string = environment.apiUrl + '/' + ApiPaths.INGREDIENT_CATEGORIES + '/byids';

  get languageId(): number {
    return SearchSnapshotTransform.toLanguageId(this.searchSnapshotService.snapshot);
  }

  constructor(private httpclient: HttpClient, private searchSnapshotService: SearchSnapshotService) {
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

  byIngredientIds(languageId: number, ids: number[]) {
    let params = new HttpParams();

    params = params.set("languageId", languageId);
    ids.forEach((id, i) => {
      params = params.append(`ingredientIds[${i}]`, id);
    });

    return this.httpclient.get<IngredientName[]>(this.byIngredientIdsUrl, {params});
  }

  byCategoryIds(languageId: number, ids: number[]) {
    let params = new HttpParams();

    params = params.set("languageId", languageId);
    ids.forEach((id, i) => {
      params = params.append(`tagIds[${i}]`, id);
    });

    return this.httpclient.get<IngredientCategory[]>(this.byCategoryIdsUrl, {params});
  }
}
