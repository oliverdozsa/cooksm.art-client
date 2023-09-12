import {Component} from '@angular/core';
import {OrderingAndFiltersParams} from "../../data/ordering-and-filters-params";
import {RecipesService} from "../../services/recipes.service";

@Component({
  selector: 'app-ordering-and-filters',
  templateUrl: './ordering-and-filters.component.html',
  styleUrls: ['./ordering-and-filters.component.scss']
})
export class OrderingAndFiltersComponent {
  params: OrderingAndFiltersParams = new OrderingAndFiltersParams();

  private _minNumberOfIngredients: number = 0;
  private _maxNumberOfIngredients: number = 0;

  private oldParams: OrderingAndFiltersParams = new OrderingAndFiltersParams();
  private isAnyParamChanged: boolean = false;

  get minNumberOfIngredients(): number {
    return this._minNumberOfIngredients;
  }

  set minNumberOfIngredients(value: number) {
    this._minNumberOfIngredients = value;
  }

  get maxNumberOfIngredients(): number {
    return this._maxNumberOfIngredients;
  }

  set maxNumberOfIngredients(value: number) {
    this._maxNumberOfIngredients = value;
  }

  get maxNumberOfIngredientsOptions(): number[] {
    if (this._minNumberOfIngredients === 30) {
      return [];
    }

    const lowerBound = this._minNumberOfIngredients === 0 ? 0 : this._minNumberOfIngredients + 1;
    return [...Array(30 - lowerBound).keys()]
      .map(o => o + lowerBound + 1);
  }

  get minNumberOfIngredientsOptions(): number[] {
    const upperBound = this._maxNumberOfIngredients === 0 ? 30 : this._maxNumberOfIngredients - 1;
    return [...Array(upperBound).keys()]
      .map(o => o + 1);
  }

  constructor(private recipesService: RecipesService) {
  }

  filterByNameClicked() {
    this.paramsEvent();
    if(this.isAnyParamChanged) {
      this.recipesService.orderingAndFiltersChanged(this.params);
    }
  }

  clearFilterByName() {
    this.params.filterByName = "";
    this.filterByNameClicked();
  }

  private paramsEvent() {
    this.isAnyParamChanged = !this.params.equals(this.oldParams);
    if(this.isAnyParamChanged) {
      this.oldParams = this.params.copy();
    }
  }
}
