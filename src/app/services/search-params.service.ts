import { Injectable } from '@angular/core';
import {TargetIngredients} from "../data/target-ingredients";
import {DisplayedIngredient} from "../data/displayed-ingredient";

@Injectable({
  providedIn: 'root'
})
export class SearchParamsService {
  ingredientsByTarget = new Map<TargetIngredients, DisplayedIngredient[]>();

  constructor() { }

  ingredientsChangedIn(target: TargetIngredients, items: DisplayedIngredient[]) {
    this.ingredientsByTarget.set(target, items);
  }
}
