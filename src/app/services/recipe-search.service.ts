import { Injectable } from '@angular/core';
import {RecipeQueryParams} from "./recipe-query-params";
import {Observable, of} from "rxjs";
import {Page} from "../data/page";
import {Recipe} from "../data/recipe";

@Injectable({
  providedIn: 'root'
})
export class RecipeSearchService {
  constructor() {

  }

  query(params: RecipeQueryParams): Observable<Page<Recipe>> {
    // TODO
    return of();
  }
}
