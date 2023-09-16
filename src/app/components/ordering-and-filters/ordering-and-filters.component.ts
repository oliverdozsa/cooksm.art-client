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

  private oldParams: OrderingAndFiltersParams = new OrderingAndFiltersParams();
  private destroy$ = new Subject<void>();

  get minNumberOfIngredients(): number {
    return this.params.minIngs === undefined ? 0: this.params.minIngs;
  }

  set minNumberOfIngredients(value: number) {
    this.params.minIngs = value === 0 ? undefined : value;
    this.paramsEvent();
  }

  get maxNumberOfIngredients(): number {
    return this.params.maxIngs === undefined ? 0: this.params.maxIngs;
  }

  set maxNumberOfIngredients(value: number) {
    this.params.maxIngs = value === 0 ? undefined : value;
    this.paramsEvent();
  }

  get maxNumberOfIngredientsOptions(): number[] {
    if (this.params.minIngs === 30) {
      return [];
    }

    const lowerBound = this.params.minIngs === undefined ? 1 : this.params.minIngs + 1;
    return [...Array(30 - lowerBound + 1).keys()]
      .map(o => o + lowerBound);
  }

  get minNumberOfIngredientsOptions(): number[] {
    const upperBound = this.params.maxIngs === undefined ? 30 : this.params.maxIngs - 1;
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
      this.recipesService.orderingAndFiltersChanged(this.params);
    }
  }
}
