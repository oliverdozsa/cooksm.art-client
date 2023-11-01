import {Component, OnDestroy} from '@angular/core';
import {OrderingAndFiltersParams} from "../../data/ordering-and-filters-params";
import {RecipesService} from "../../services/recipes.service";
import {OrderingAndFiltersRecipeServiceOpsHandler} from "./ordering-and-filters-recipe-service-ops-handler";
import {Subject, takeUntil} from "rxjs";
import {CookingTime} from 'src/app/data/recipe';
import {SourcePagesService} from "../../services/source-pages.service";
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from "ngx-bootstrap-multiselect";
import {SourcePageSelections} from "./source-page-selections";

@Component({
  selector: 'app-ordering-and-filters',
  templateUrl: './ordering-and-filters.component.html',
  styleUrls: ['./ordering-and-filters.component.scss']
})
export class OrderingAndFiltersComponent implements OnDestroy {
  params: OrderingAndFiltersParams = new OrderingAndFiltersParams();
  sourcePageSelections: SourcePageSelections | undefined;

  private oldParams: OrderingAndFiltersParams = new OrderingAndFiltersParams();
  private destroy$ = new Subject<void>();

  get minNumberOfIngredients(): number {
    return this.params.minIngs === undefined ? 0 : this.params.minIngs;
  }

  set minNumberOfIngredients(value: number) {
    this.params.minIngs = value === 0 ? undefined : value;
    this.paramsEvent();
  }

  get maxNumberOfIngredients(): number {
    return this.params.maxIngs === undefined ? 0 : this.params.maxIngs;
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

  get isQuickSelected(): boolean {
    return this.isUsed(CookingTime.Quick)
  }

  set isQuickSelected(value: boolean) {
    this.shouldUse(CookingTime.Quick, value);
    this.paramsEvent();
  }

  get isAverageSelected(): boolean {
    return this.isUsed(CookingTime.Average)
  }

  set isAverageSelected(value: boolean) {
    this.shouldUse(CookingTime.Average, value);
    this.paramsEvent();
  }

  get isLengthySelected(): boolean {
    return this.isUsed(CookingTime.Lengthy)
  }

  set isLengthySelected(value: boolean) {
    this.shouldUse(CookingTime.Lengthy, value);
    this.paramsEvent();
  }

  get isAnyCookingTimeUsed(): boolean {
    return this.params.times != undefined && this.params.times.length > 0;
  }

  constructor(private recipesService: RecipesService, public sourcePagesService: SourcePagesService) {
    const opsHandler = new OrderingAndFiltersRecipeServiceOpsHandler(this);
    recipesService.operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ops => opsHandler.process(ops));

    sourcePagesService.allSourcePageAvailable$.subscribe({
      next: () => this.onSourcePagesAvailable()
    })
  }

  onSourcePagesAvailable() {
    this.sourcePageSelections = new SourcePageSelections(this);
    if(this.params.sourcePages) {
      this.sourcePageSelections.select(this.params.sourcePages);
    }
  }

  filterByNameClicked() {
    this.paramsEvent();
  }

  clearFilterByName() {
    this.params.filterByName = "";
    this.filterByNameClicked();
  }

  clearCookingTimes() {
    this.params.times = undefined;
    this.paramsEvent();
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

  private isUsed(value: CookingTime): boolean {
    return this.params.times?.find(t => t === value) != undefined;
  }

  private shouldUse(value: CookingTime, shouldBeUsed: boolean) {
    if (shouldBeUsed) {
      this.params.addCookingTimeFilter(value);
    } else {
      this.params.removeCookingTimeFilter(value);
    }
  }
}
