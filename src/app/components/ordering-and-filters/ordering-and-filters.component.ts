import {Component, OnDestroy} from '@angular/core';
import {OrderingAndFiltersParams} from "../../data/ordering-and-filters-params";
import {RecipesService} from "../../services/recipes.service";
import {OrderingAndFiltersRecipeServiceOpsHandler} from "./ordering-and-filters-recipe-service-ops-handler";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-ordering-and-filters',
  templateUrl: './ordering-and-filters.component.html',
  styleUrls: ['./ordering-and-filters.component.scss']
})
export class OrderingAndFiltersComponent implements OnDestroy {
  params: OrderingAndFiltersParams = new OrderingAndFiltersParams();

  private _minNumberOfIngredients: number = 0;
  private _maxNumberOfIngredients: number = 0;

  private oldParams: OrderingAndFiltersParams = new OrderingAndFiltersParams();
  private destroy$ = new Subject<void>();

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

  get orderByAndSort(): string | undefined {
    return this.params.orderBySortAsStr();
  }

  set orderByAndSort(value: string | undefined) {
    this.params.setOrderBySortFromStr(value);
    this.paramsEvent();
  }

  constructor(private recipesService: RecipesService) {
    const opsHandler = new OrderingAndFiltersRecipeServiceOpsHandler(this);
    recipesService.operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ops => opsHandler.process(ops));
  }

  filterByNameClicked() {
    this.paramsEvent();
  }

  clearFilterByName() {
    this.params.filterByName = "";
    this.filterByNameClicked();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  paramsEvent() {
    const isAnyParamChanged = !this.params.equals(this.oldParams);
    if (isAnyParamChanged) {
      this.oldParams = this.params.copy();
    }

    if (isAnyParamChanged) {
      this.recipesService.orderingAndFiltersChanged(this.params);
    }
  }
}
