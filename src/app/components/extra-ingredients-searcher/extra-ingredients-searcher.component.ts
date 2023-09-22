import {Component, OnDestroy} from '@angular/core';
import {TargetIngredients} from "../../data/target-ingredients";
import {ExtraRelation} from "../../data/extra-ingredients";
import {RecipesService} from "../../services/recipes.service";
import {Subject, takeUntil} from "rxjs";
import {ExtraIngredientsRecipeServiceOpsHandler} from "./extra-ingredients-recipe-service-ops-handler";

@Component({
  selector: 'app-extra-ingredients-searcher',
  templateUrl: './extra-ingredients-searcher.component.html',
  styleUrls: ['./extra-ingredients-searcher.component.scss']
})
export class ExtraIngredientsSearcherComponent implements OnDestroy {
  TargetIngredients = TargetIngredients;
  ExtraRelation = ExtraRelation;

  valueOptions = new Array(20);
  isEnabled = false;

  private _relation: ExtraRelation = ExtraRelation.CanBeMoreThan;
  private _relationValue: number = 1;

  private destroy$ = new Subject<void>();

  constructor(private recipesService: RecipesService) {
    const operationHandler = new ExtraIngredientsRecipeServiceOpsHandler(this);
    recipesService.operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: o => operationHandler.process(o)
      });
  }

  set relation(value: ExtraRelation) {
    this._relation = value;
    this.recipesService.extraIngredientsRelationChanged(this.relation, this.relationValue);
  }

  get relation(): ExtraRelation {
    return this._relation;
  }

  set relationValue(value: number) {
    this._relationValue = value;
    this.recipesService.extraIngredientsRelationChanged(this.relation, this.relationValue);
  }

  get relationValue(): number {
    return this._relationValue;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  forceSetRelationTo(value: ExtraRelation) {
    this._relation = value;
  }

  forceSetValueTo(value: number) {
    this._relationValue = value;
  }

  setMaxOptions(value: number) {
    this.valueOptions = new Array(value);
  }
}
