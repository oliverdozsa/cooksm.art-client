import {Component} from '@angular/core';

@Component({
  selector: 'app-ordering-and-filters',
  templateUrl: './ordering-and-filters.component.html',
  styleUrls: ['./ordering-and-filters.component.scss']
})
export class OrderingAndFiltersComponent {
  private _minNumberOfIngredients: number = 0;
  private _maxNumberOfIngredients: number = 0;

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
    return [-1].concat([...Array(30 - lowerBound).keys()])
      .map(o => o + lowerBound + 1);
  }

  get minNumberOfIngredientsOptions(): number[] {
    const upperBound = this._maxNumberOfIngredients === 0 ? 30 : this._maxNumberOfIngredients - 1;
    return [-1].concat([...Array(upperBound).keys()])
      .map(o => o + 1);
  }
}
