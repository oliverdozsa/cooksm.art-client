import { Injectable } from '@angular/core';
import {TargetIngredients} from "../data/target-ingredients";
import {DisplayedIngredient} from "../data/displayed-ingredient";
import {Subject} from "rxjs";
import {SearchParamsOperation} from "./search-params-operation";

@Injectable({
  providedIn: 'root'
})
export class SearchParamsService {
  ingredientsByTarget = new Map<TargetIngredients, DisplayedIngredient[]>();
  operation$ = new Subject<SearchParamsOperation>();

  constructor() { }

  ingredientsChangedIn(target: TargetIngredients, items: DisplayedIngredient[]) {
    this.ingredientsByTarget.set(target, items);
  }
}
