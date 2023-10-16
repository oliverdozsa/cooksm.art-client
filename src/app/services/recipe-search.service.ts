import { Injectable } from '@angular/core';
import {RecipeQueryParams} from "./recipe-query-params";
import {delay, Observable, of, tap} from "rxjs";
import {Page} from "../data/page";
import {Recipe} from "../data/recipe";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiPaths} from "../api-paths";
import {environment} from "../../environments/environment";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class RecipeSearchService {
  private readonly recipesUrl = environment.apiUrl + '/' + ApiPaths.RECIPES;

  constructor(private httpClient: HttpClient, private spinnerService: NgxSpinnerService) {
  }

  query(queryParams: RecipeQueryParams): Observable<Page<Recipe>> {
    this.spinnerService.show("recipePaging")
    let httpParams = new HttpParams();
    httpParams = this.setQueryParams(queryParams, httpParams);
    return this.httpClient.get<Page<Recipe>>(this.recipesUrl, {params: httpParams})
      .pipe(
        delay(200),
        tap(
          () => this.spinnerService.hide("recipePaging"),
          () => this.spinnerService.hide("recipePaging")
        )
      );
  }

  private setQueryParams(queryParams: RecipeQueryParams, params: HttpParams) {
    const offset = 0;
    const limit = 25;
    params = params.set('offset', offset.toString()).set('limit', limit.toString());

    if (queryParams) {
      params = this.setQueryParam(queryParams.offset, 'offset', params);
      params = this.setQueryParam(queryParams.limit, 'limit', params);
      params = this.setQueryParam(queryParams.minIngs, 'minIngs', params);
      params = this.setQueryParam(queryParams.maxIngs, 'maxIngs', params);
      params = this.setQueryParam(queryParams.orderBy, 'orderBy', params);
      params = this.setQueryParam(queryParams.orderBySort, 'orderBySort', params);
      params = this.setQueryParam(queryParams.nameLike, 'nameLike', params);
      params = this.setQueryParam(queryParams.goodIngsRatio, 'goodIngsRatio', params);
      params = this.setQueryParam(queryParams.unknownIngs, 'unknownIngs', params);
      params = this.setQueryParam(queryParams.unknownIngsRel, 'unknownIngsRel', params);
      params = this.setQueryParam(queryParams.goodIngs, 'goodIngs', params);
      params = this.setQueryParam(queryParams.goodAdditionalIngs, 'goodAdditionalIngs', params);
      params = this.setQueryParam(queryParams.goodAdditionalIngsRel, 'goodAdditionalIngsRel', params);
      params = this.setQueryParam(queryParams.goodIngsRel, 'goodIngsRel', params);
      params = this.setQueryParam(queryParams.searchMode, 'searchMode', params);
      params = this.setQueryParam(queryParams.useFavoritesOnly, 'useFavoritesOnly', params);
      params = this.setArrayQueryParam(queryParams.exIngs, 'exIngs', params);
      params = this.setArrayQueryParam(queryParams.exIngTags, 'exIngTags', params);
      params = this.setArrayQueryParam(queryParams.inIngs, 'inIngs', params);
      params = this.setArrayQueryParam(queryParams.inIngTags, 'inIngTags', params);
      params = this.setArrayQueryParam(queryParams.addIngs, 'addIngs', params);
      params = this.setArrayQueryParam(queryParams.addIngTags, 'addIngTags', params);
      params = this.setArrayQueryParam(queryParams.sourcePages, 'sourcePages', params);
      params = this.setArrayQueryParam(queryParams.times, 'times', params);
      params = this.setArrayQueryParam(queryParams.recipeBooks, 'recipeBooks', params);
    }

    return params;
  }

  private setQueryParam(value: any, name: string, params: HttpParams): HttpParams {
    if (value || typeof value === 'number' || typeof value === 'boolean') {
      params = params.set(name, value.toString());
    }

    return params;
  }

  private setArrayQueryParam(items: any[], arrayName: string, params: HttpParams): HttpParams {
    if (items && items.length) {
      items.forEach((p, i) => params = this.appendQueryParam(p, arrayName + `[${i}]`, params));
    }

    return params;
  }

  private appendQueryParam(value: any, name: string, params: HttpParams): HttpParams {
    if (value || typeof value === 'number') {
      params = params.append(name, value.toString());
    }

    return params;
  }
}
